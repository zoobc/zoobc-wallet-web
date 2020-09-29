import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import { Subscription } from 'rxjs';
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
  currencySubs: Subscription;

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

  stepper = {
    multisigInfo: false,
    signatures: false,
  };

  sendMoneyForm = {
    sender: 'sender',
    recipient: 'recipient',
    alias: 'alias',
    typeCoin: 'typeCoin',
    amountCurrency: 'amountCurrency',
    amount: 'amount',
    typeFee: 'typeFee',
    feeCurrency: 'feeCurr',
    fee: 'fee',
  };

  constructor(
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
  }

  ngOnInit() {
    // Currency Subscriptions
    this.currencySubs = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      this.feeFormCurr.patchValue(minCurrency);
      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
      this.amountCurrencyForm.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    // Multisignature Subscription
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo, unisgnedTransactions, signaturesInfo, sendMoney } = multisig;
      if (unisgnedTransactions === undefined) this.router.navigate(['/multisignature']);

      this.multisig = multisig;
      if (signaturesInfo && signaturesInfo.txHash) this.createTransactionForm.disable();

      this.senderForm.setValue(multisig.generatedSender);

      if (sendMoney) {
        const { sender, recipient, amount, fee } = sendMoney;
        this.senderForm.setValue(sender);
        this.recipientForm.setValue(recipient);
        this.amountForm.setValue(amount);
        this.amountCurrencyForm.setValue(amount * this.currencyRate.value);
        this.feeForm.setValue(fee);
        this.feeFormCurr.setValue(fee * this.currencyRate.value);
      }
      this.stepper.multisigInfo = multisigInfo !== undefined ? true : false;
      this.stepper.signatures = signaturesInfo !== undefined ? true : false;
    });
  }

  async generateDownloadJsonUri() {
    const { signaturesInfo } = this.multisig;
    if (signaturesInfo === null) {
      this.updateCreateTransaction();
      const title = getTranslation('are you sure?', this.translate);
      const message = getTranslation('you will not be able to update the form anymore!', this.translate);
      const buttonText = getTranslation('yes, continue it!', this.translate);
      const isConfirm = await Swal.fire({
        title: title,
        text: message,
        showCancelButton: true,
        confirmButtonText: buttonText,
        type: 'warning',
      }).then(result => {
        if (result.value) {
          this.generatedTxHash();
          this.createTransactionForm.disable();
          return true;
        } else return false;
      });
      if (!isConfirm) return false;
    }

    let theJSON = JSON.stringify(this.multisig);
    const blob = new Blob([theJSON], { type: 'application/JSON' });
    saveAs(blob, 'Multisignature-Draft.json');
  }

  ngOnDestroy() {
    this.currencySubs.unsubscribe();
    this.multisigSubs.unsubscribe();
  }

  async next() {
    try {
      if (this.multisig.signaturesInfo !== null) this.createTransactionForm.enable();

      const total = this.amountForm.value + this.feeForm.value;
      const balance = await zoobc.Account.getBalance(this.senderForm.value).then(
        (res: AccountBalanceResponse) => parseInt(res.accountbalance.spendablebalance) / 1e8
      );
      if (balance < total) {
        const message = getTranslation('your balances are not enough for this transaction', this.translate);
        return Swal.fire({ type: 'error', title: 'Oops...', text: message });
      }
      if (this.createTransactionForm.valid) {
        this.updateCreateTransaction();
        const { signaturesInfo } = this.multisig;
        if (this.multisig.signaturesInfo === null) {
          const title = getTranslation('are you sure?', this.translate);
          const message = getTranslation('you will not be able to update the form anymore!', this.translate);
          const buttonText = getTranslation('yes, continue it!', this.translate);

          const isConfirm = await Swal.fire({
            title: title,
            text: message,
            showCancelButton: true,
            confirmButtonText: buttonText,
            type: 'warning',
          }).then(result => {
            if (result.value) {
              this.generatedTxHash();
              return true;
            } else return false;
          });
          if (!isConfirm) return false;
        }

        if (signaturesInfo === undefined) this.router.navigate(['/multisignature/send-transaction']);
        else this.router.navigate(['/multisignature/add-signatures']);
      }
    } catch (err) {
      console.log(err);
      let message = getTranslation(err.message, this.translate);
      return Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  saveDraft() {
    this.updateCreateTransaction();
    if (this.multisig.id) this.multisigServ.editDraft();
    else this.multisigServ.saveDraft();
    this.router.navigate(['/multisignature']);
  }

  updateCreateTransaction() {
    const { recipient, amount, fee, sender } = this.createTransactionForm.value;
    const multisig = { ...this.multisig };

    multisig.sendMoney = { sender, amount, fee, recipient };
    this.multisigServ.update(multisig);
  }

  back() {
    this.location.back();
  }

  generatedTxHash() {
    const { recipient, amount, fee, sender } = this.createTransactionForm.value;
    const { unisgnedTransactions, multisigInfo } = this.multisig;
    const data: SendMoneyInterface = { sender, recipient, fee, amount };

    if (unisgnedTransactions === null) this.multisig.unisgnedTransactions = sendMoneyBuilder(data);

    if (this.multisig.signaturesInfo !== undefined) {
      const txHash = generateTransactionHash(data);
      const participants = multisigInfo.participants.map(address => ({
        address,
        signature: stringToBuffer(''),
      }));
      this.multisig.signaturesInfo = { txHash, participants };
    }
  }
}
