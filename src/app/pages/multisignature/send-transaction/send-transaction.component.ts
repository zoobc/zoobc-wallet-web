import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { getTranslation, jsonBufferToString } from 'src/helpers/utils';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import zoobc, {
  MultiSigInterface,
  MultisigPostTransactionResponse,
  AccountBalanceResponse,
  isZBCAddressValid,
} from 'zoobc-sdk';
import { SignatureInfo } from 'zoobc-sdk/types/helper/transaction-builder/multisignature';
import { createInnerTxBytes, getTxType } from 'src/helpers/multisig-utils';

@Component({
  selector: 'app-send-transaction',
  templateUrl: './send-transaction.component.html',
  styleUrls: ['./send-transaction.component.scss'],
})
export class SendTransactionComponent implements OnInit {
  @ViewChild('confirmDialog') confirmDialog: TemplateRef<any>;
  confirmRefDialog: MatDialogRef<any>;

  account: SavedAccount;
  accounts: SavedAccount[];
  formSend: FormGroup;
  minFee = environment.fee;
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);

  advancedMenu: boolean = false;

  multisig: MultiSigDraft;
  multisigSubs: Subscription;
  multiSigDrafts: MultiSigDraft[];

  isMultiSigAccount: boolean = false;
  participants = [];
  accountBalance: any;

  txType: string = '';
  innerTx: any[] = [];
  innerPage: number;
  isLoading: boolean = false;

  constructor(
    private authServ: AuthService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private router: Router,
    private multisigServ: MultisigService,
    private location: Location
  ) {
    this.formSend = new FormGroup({
      fee: this.feeForm,
    });
  }

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    if (this.account.type === 'multisig') this.isMultiSigAccount = true;
    this.accounts = this.authServ.getAllAccount();

    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo } = multisig;
      if (multisigInfo === undefined) return this.router.navigate(['/multisignature']);
      this.multisig = multisig;
      const { fee } = this.multisig;
      if (fee >= this.minFee) {
        this.feeForm.setValue(fee);
        this.feeForm.markAsTouched();
      }
    });
    this.participants = this.multisig.multisigInfo.participants;
    this.getMultiSigDraft();
  }

  getMultiSigDraft() {
    this.multiSigDrafts = this.multisigServ.getDrafts();
  }

  saveDraft() {
    this.updateSendTransaction();
    const isDraft = this.multiSigDrafts.some(draft => draft.id == this.multisig.id);
    if (isDraft) {
      this.multisigServ.editDraft();
    } else {
      this.multisigServ.saveDraft();
    }
    this.router.navigate(['/multisignature']);
  }

  updateSendTransaction() {
    const { fee } = this.formSend.value;
    const multisig = { ...this.multisig };
    multisig.fee = fee;
    this.multisigServ.update(multisig);
  }

  back() {
    this.location.back();
  }

  ngOnDestroy() {
    this.multisigSubs.unsubscribe();
    this.authServ.switchMultisigAccount();
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.authServ.switchAccount(account);
  }

  async onOpenConfirmDialog() {
    await this.getBalance();
    const balance = parseInt(this.accountBalance.spendablebalance) / 1e8;
    if (balance >= this.minFee) {
      this.fillDialog();
      this.confirmRefDialog = this.dialog.open(this.confirmDialog, {
        width: '500px',
        maxHeight: '90vh',
      });
    } else {
      let message = getTranslation('your balances are not enough for this transaction', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  async getBalance() {
    this.isLoading = true;
    await zoobc.Account.getBalance(this.account.address).then((data: AccountBalanceResponse) => {
      this.accountBalance = data.accountbalance;
      this.isLoading = false;
    });
  }

  async onConfirm() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });

    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        this.confirmRefDialog.close();
        this.onSendMultiSignatureTransaction();
      }
    });
  }

  async onSendMultiSignatureTransaction() {
    this.updateSendTransaction();
    let { accountAddress, fee, multisigInfo, unisgnedTransactions, signaturesInfo, txBody } = this.multisig;
    let data: MultiSigInterface;
    if (signaturesInfo !== undefined) {
      const signatureInfoFilter: SignatureInfo = {
        txHash: signaturesInfo.txHash,
        participants: [],
      };
      signatureInfoFilter.participants = signaturesInfo.participants.filter(pcp => {
        if (jsonBufferToString(pcp.signature).length > 0) return pcp;
      });
      this.account = this.authServ.getCurrAccount();
      accountAddress = this.account.address;
      data = {
        accountAddress,
        fee,
        multisigInfo,
        unisgnedTransactions,
        signaturesInfo: signatureInfoFilter,
      };
    } else {
      this.account = this.authServ.getCurrAccount();
      accountAddress = this.account.address;
      data = {
        accountAddress,
        fee,
        multisigInfo,
        unisgnedTransactions,
        signaturesInfo,
      };
    }
    const childSeed = this.authServ.seed;

    if (data.signaturesInfo === undefined)
      data.unisgnedTransactions = createInnerTxBytes(this.multisig.txBody, this.multisig.txType);
    zoobc.MultiSignature.postTransaction(data, childSeed)
      .then(async (res: MultisigPostTransactionResponse) => {
        let message = getTranslation('your transaction is processing', this.translate);
        let subMessage = getTranslation('you send coins to', this.translate, {
          amount: txBody.amount,
          recipient: txBody.recipient,
        });
        this.multisigServ.deleteDraft(this.multisig.id);
        Swal.fire(message, subMessage, 'success');
        this.router.navigateByUrl('/dashboard');
      })
      .catch(async err => {
        console.log(err.message);
        let message = getTranslation(err.message, this.translate);
        Swal.fire('Opps...', message, 'error');
      });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  counter(i: number) {
    return new Array(i);
  }

  fillDialog() {
    this.txType = getTxType(this.multisig.txType);
    this.innerTx = Object.keys(this.multisig.txBody).map(key => {
      const item = this.multisig.txBody;
      return {
        key,
        value: item[key],
        isAddress: isZBCAddressValid(item[key]),
      };
    });
    const div = Math.floor(this.innerTx.length / 2);
    const mod = Math.floor(this.innerTx.length % 2);
    this.innerPage = div + mod;
  }

  getClass(i: number) {
    if (i % 2 != 0) return true;
    return false;
  }

  getItemByKey(i: number, j: number, key: string) {
    const index = i * 2 + j;
    const obj = this.innerTx[index];
    if (obj) return obj[key];
    return '';
  }
}
