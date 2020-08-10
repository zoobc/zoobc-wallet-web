import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import { Subscription } from 'rxjs';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { truncate, getTranslation, stringToBuffer } from 'src/helpers/utils';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import zoobc, {
  SendMoneyInterface,
  generateTransactionHash,
  sendMoneyBuilder,
  AccountBalanceResponse,
} from 'zoobc-sdk';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss'],
})
export class CreateTransactionComponent implements OnInit {
  minFee = environment.fee;
  currencyRate: Currency;
  subscription: Subscription = new Subscription();
  account: SavedAccount;

  isCompleted = true;
  createTransactionForm: FormGroup;
  senderForm = new FormControl('', Validators.required);
  recipientForm = new FormControl('', Validators.required);
  amountForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  amountCurrencyForm = new FormControl('', Validators.required);
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  typeCoinField = new FormControl('ZBC');
  typeFeeField = new FormControl('ZBC');

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  txHash: string;
  isMultiSignature: boolean = false;
  isHasTransactionHash: boolean = false;
  removeExport: boolean = false;
  accountBalance: number;

  stepper = {
    multisigInfo: false,
    signatures: false,
  };

  constructor(
    private authServ: AuthService,
    private currencyServ: CurrencyRateService,
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private translate: TranslateService
  ) {
    this.createTransactionForm = new FormGroup({
      sender: this.senderForm,
      recipient: this.recipientForm,
      amount: this.amountForm,
      amountCurrency: this.amountCurrencyForm,
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      typeCoin: this.typeCoinField,
      typeFee: this.typeFeeField,
    });
    this.account = this.authServ.getCurrAccount();
    this.isMultiSignature = this.account.type == 'multisig' ? true : false;
  }

  ngOnInit() {
    // Currency Subscriptions
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      this.feeFormCurr.patchValue(minCurrency);
      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
      this.amountCurrencyForm.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);
    // Multisignature Subscription
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo, unisgnedTransactions, signaturesInfo, transaction } = multisig;
      if (unisgnedTransactions === undefined) this.router.navigate(['/multisignature']);

      this.multisig = multisig;
      this.removeExport = signaturesInfo !== undefined ? true : false;
      if (unisgnedTransactions !== null) this.isHasTransactionHash = true;
      if (signaturesInfo) {
        this.isHasTransactionHash = signaturesInfo.txHash !== undefined ? true : false;
      }
      if (this.isHasTransactionHash) this.createTransactionForm.disable();

      if (unisgnedTransactions) {
        const { sender, recipient, amount, fee } = transaction;
        this.account.address = sender;
        this.senderForm.setValue(sender);
        this.recipientForm.setValue(recipient);
        this.amountForm.setValue(amount);
        this.amountCurrencyForm.setValue(amount * this.currencyRate.value);
        this.feeForm.setValue(fee);
        this.feeFormCurr.setValue(fee * this.currencyRate.value);
      } else if (this.isMultiSignature) {
        this.multisig.generatedSender = this.account.address;
        this.senderForm.setValue(this.account.address);
        this.getBalance(this.account.address);
      } else {
        this.senderForm.setValue(this.multisig.generatedSender);
        this.getBalance(this.multisig.generatedSender);
      }
      this.stepper.multisigInfo = multisigInfo !== undefined ? true : false;
      this.stepper.signatures = signaturesInfo !== undefined ? true : false;
    });
  }

  async generateDownloadJsonUri() {
    if (!this.isHasTransactionHash) {
      let title = getTranslation('are you sure?', this.translate);
      let message = getTranslation('you will not be able to update the form anymore!', this.translate);
      let buttonText = getTranslation('yes, continue it!', this.translate);
      Swal.fire({
        title: title,
        text: message,
        showCancelButton: true,
        confirmButtonText: buttonText,
        type: 'warning',
      }).then(result => {
        if (result.value) {
          this.generatedTxHash();
          this.updateCreateTransaction();
          let theJSON = JSON.stringify(this.multisig);
          const blob = new Blob([theJSON], { type: 'application/JSON' });
          saveAs(blob, 'Multisignature-Draft.json');
        }
      });
    } else {
      let theJSON = JSON.stringify(this.multisig);
      const blob = new Blob([theJSON], { type: 'application/JSON' });
      saveAs(blob, 'Multisignature-Draft.json');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.multisigSubs.unsubscribe();
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.senderForm.setValue(account);
  }

  async next() {
    const total = this.amountForm.value + this.feeForm.value;
    if (this.multisig.signaturesInfo !== null) this.createTransactionForm.enable();
    if (this.accountBalance / 1e8 < total) {
      let message = getTranslation('your balances are not enough for this transaction', this.translate);
      return Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
    if (this.createTransactionForm.valid) {
      const { signaturesInfo } = this.multisig;
      if (!this.multisig.unisgnedTransactions) {
        let title = getTranslation('are you sure?', this.translate);
        let message = getTranslation('you will not be able to update the form anymore!', this.translate);
        let buttonText = getTranslation('yes, continue it!', this.translate);
        Swal.fire({
          title: title,
          text: message,
          showCancelButton: true,
          confirmButtonText: buttonText,
          type: 'warning',
        }).then(result => {
          if (result.value) {
            this.generatedTxHash();
            this.updateCreateTransaction();

            if (signaturesInfo === undefined) this.router.navigate(['/multisignature/send-transaction']);
            else this.router.navigate(['/multisignature/add-signatures']);
          }
        });
      } else if (signaturesInfo !== undefined) this.router.navigate(['/multisignature/add-signatures']);
      else this.router.navigate(['/multisignature/send-transaction']);
    }
  }

  saveDraft() {
    this.updateCreateTransaction();
    if (this.multisig.id) this.multisigServ.editDraft();
    else this.multisigServ.saveDraft();
    this.router.navigate(['/multisignature']);
  }

  updateCreateTransaction() {
    const { recipient, amount, fee } = this.createTransactionForm.value;
    const multisig = { ...this.multisig };
    const address = this.multisig.generatedSender || this.account.address;

    multisig.transaction = {
      sender: address,
      amount: amount,
      fee: fee,
      recipient: recipient,
    };
    this.multisigServ.update(multisig);
  }

  back() {
    this.location.back();
  }

  generatedTxHash() {
    this.updateCreateTransaction();
    const { amount, fee, recipient, sender } = this.multisig.transaction;
    const data: SendMoneyInterface = {
      sender: sender,
      recipient: recipient,
      fee: fee,
      amount: amount,
    };
    const accounts = this.authServ.getAllAccount();
    const account = accounts.find(acc => acc.address == sender);
    let participantAccount = [];

    if (this.multisig.unisgnedTransactions !== undefined) {
      this.multisig.unisgnedTransactions = sendMoneyBuilder(data);
    }

    if (this.multisig.signaturesInfo !== undefined) {
      if (account) {
        for (let i = 0; i < account.participants.length; i++) {
          let participant = {
            address: account.participants[i],
            signature: stringToBuffer(''),
          };
          participantAccount.push(participant);
        }
      } else {
        for (let i = 0; i < this.multisig.multisigInfo.participants.length; i++) {
          let participant = {
            address: this.multisig.multisigInfo.participants[i],
            signature: stringToBuffer(''),
          };
          participantAccount.push(participant);
        }
      }
      this.txHash = generateTransactionHash(data);
      this.multisig.signaturesInfo = {
        txHash: this.txHash,
        participants: participantAccount,
      };
      this.isHasTransactionHash = true;
      this.multisig.generatedSender = this.multisig.transaction.sender;
    }
  }

  getBalance(address: string) {
    zoobc.Account.getBalance(address).then((res: AccountBalanceResponse) => {
      this.accountBalance = parseInt(res.accountbalance.spendablebalance);
    });
  }
}
