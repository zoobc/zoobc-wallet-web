import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';
import { truncate, getTranslation, jsonBufferToString } from 'src/helpers/utils';
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
  sendMoneyBuilder,
  AccountBalanceResponse,
} from 'zoobc-sdk';
import { SignatureInfo } from 'zoobc-sdk/types/helper/transaction-builder/multisignature';

@Component({
  selector: 'app-send-transaction',
  templateUrl: './send-transaction.component.html',
  styleUrls: ['./send-transaction.component.scss'],
})
export class SendTransactionComponent implements OnInit {
  @ViewChild('confirmDialog') confirmDialog: TemplateRef<any>;
  confirmRefDialog: MatDialogRef<any>;

  currencySubs: Subscription;

  account: SavedAccount;
  accounts: SavedAccount[];
  formSend: FormGroup;
  minFee = environment.fee;
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  typeFeeField = new FormControl('ZBC');

  currencyRate: Currency;
  advancedMenu: boolean = false;

  multisig: MultiSigDraft;
  multisigSubs: Subscription;
  multiSigDrafts: MultiSigDraft[];

  isMultiSigAccount: boolean = false;
  participants = [];
  accountBalance: any;

  constructor(
    private authServ: AuthService,
    private currencyServ: CurrencyRateService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private router: Router,
    private multisigServ: MultisigService,
    private location: Location
  ) {
    this.formSend = new FormGroup({
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      typeFee: this.typeFeeField,
    });
  }

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    if (this.account.type === 'multisig') this.isMultiSigAccount = true;
    this.accounts = this.authServ.getAllAccount();
    this.currencySubs = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
      this.feeFormCurr.patchValue(minCurrency);
    });

    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo } = multisig;
      if (multisigInfo === undefined) return this.router.navigate(['/multisignature']);
      this.multisig = multisig;
      const { fee } = this.multisig;
      if (fee >= this.minFee) {
        this.feeForm.setValue(fee);
        this.feeFormCurr.setValue(fee * this.currencyRate.value);
        this.feeForm.markAsTouched();
        this.feeFormCurr.markAsTouched();
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
    this.currencySubs.unsubscribe();
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
    await zoobc.Account.getBalance(this.account.address).then((data: AccountBalanceResponse) => {
      this.accountBalance = data.accountbalance;
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
    let {
      accountAddress,
      fee,
      multisigInfo,
      unisgnedTransactions,
      signaturesInfo,
      transaction,
    } = this.multisig;
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
      data.unisgnedTransactions = sendMoneyBuilder(this.multisig.transaction);
    zoobc.MultiSignature.postTransaction(data, childSeed)
      .then(async (res: MultisigPostTransactionResponse) => {
        let message = getTranslation('your transaction is processing', this.translate);
        let subMessage = getTranslation('you send coins to', this.translate, {
          amount: transaction.amount,
          currencyValue: truncate(transaction.amount * this.currencyRate.value, 2),
          currencyName: this.currencyRate.name,
          recipient: transaction.recipient,
        });
        this.multisigServ.deleteDraft(this.multisig.id);
        Swal.fire(message, subMessage, 'success');
        this.router.navigateByUrl('/dashboard');
      })
      .catch(async err => {
        console.log(err.message);
        // let message = getTranslation('an error occurred while processing your request', this.translate);
        Swal.fire('Opps...', err.message, 'error');
      });
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
