import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { getTranslation } from 'src/helpers/utils';
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
  AccountBalance,
  isZBCAddressValid,
  getZBCAddress,
} from 'zoobc-sdk';
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
  participants = [];
  innerTx: any[] = [];

  formSend: FormGroup;
  minFee = environment.fee;
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);

  advancedMenu: boolean = false;

  multisig: MultiSigDraft;
  multisigSubs: Subscription;
  txType: string = '';
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
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      this.multisig = multisig;
    });
    if (this.multisig.multisigInfo === undefined) return this.router.navigate(['/multisignature']);
    this.participants = this.multisig.multisigInfo.participants.map(pc => pc.value);
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
    const balance = await this.getBalance();
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

  async getBalance(): Promise<number> {
    const balance = await zoobc.Account.getBalance(this.account.address).then((data: AccountBalance) => data);
    return balance.spendableBalance / 1e8;
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
    const { multisigInfo, signaturesInfo } = this.multisig;
    const unisgnedTransactions = createInnerTxBytes(this.multisig.txBody, this.multisig.txType);
    const data: MultiSigInterface = {
      accountAddress: this.account.address,
      fee: this.feeForm.value,
      multisigInfo,
      unisgnedTransactions: unisgnedTransactions,
      signaturesInfo,
    };

    const childSeed = this.authServ.seed;
    console.log(data);
    console.log(getZBCAddress(childSeed.publicKey));

    zoobc.MultiSignature.postTransaction(data, childSeed)
      .then(async (res: MultisigPostTransactionResponse) => {
        let message = getTranslation('your transaction is processing', this.translate);
        let subMessage = getTranslation('please tell the participant to approve it', this.translate);
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
  }
}
