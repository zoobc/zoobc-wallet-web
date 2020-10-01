import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import { Subscription } from 'rxjs';
import { truncate, getTranslation, stringToBuffer } from 'src/helpers/utils';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { generateTransactionHash } from 'zoobc-sdk';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { createInnerTxForm, createTxBytes, getFieldList } from 'src/helpers/multisig-utils';
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

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  stepper = {
    multisigInfo: false,
    signatures: false,
  };

  fieldList: object;

  constructor(
    private currencyServ: CurrencyRateService,
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private translate: TranslateService
  ) {
    const subs = this.multisigServ.multisig.subscribe(multisig => {
      this.createTransactionForm = createInnerTxForm(multisig.txType);
      this.fieldList = getFieldList(multisig.txType);
    });
    subs.unsubscribe();
  }

  ngOnInit() {
    // Currency Subscriptions
    this.currencySubs = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      const feeFormCurr = this.createTransactionForm.get('feeCurr');
      // const amountCurrencyForm = this.createTransactionForm.get('amountCurrency');
      feeFormCurr.patchValue(minCurrency);
      feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
      // amountCurrencyForm.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    // Multisignature Subscription
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo, unisgnedTransactions, signaturesInfo, txBody } = multisig;
      if (unisgnedTransactions === undefined) this.router.navigate(['/multisignature']);

      this.multisig = multisig;
      if (signaturesInfo && signaturesInfo.txHash) this.createTransactionForm.disable();

      const senderForm = this.createTransactionForm.get('sender');
      senderForm.setValue(multisig.generatedSender);

      // if (sendMoney) {
      //   const { sender, recipient, amount, fee } = txBody;
      //   this.senderForm.setValue(sender);
      //   this.recipientForm.setValue(recipient);
      //   this.amountForm.setValue(amount);
      //   this.amountCurrencyForm.setValue(amount * this.currencyRate.value);
      //   this.feeForm.setValue(fee);
      //   this.feeFormCurr.setValue(fee * this.currencyRate.value);
      // }
      if (txBody) this.createTransactionForm.setValue(multisig.txBody);
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

      // const amountForm = this.createTransactionForm.get('amount');
      // const feeForm = this.createTransactionForm.get('fee');
      // const senderForm = this.createTransactionForm.get('sender');

      // const total = amountForm.value + feeForm.value;
      // const balance = await zoobc.Account.getBalance(senderForm.value).then(
      //   (res: AccountBalanceResponse) => parseInt(res.accountbalance.spendablebalance) / 1e8
      // );
      // if (balance < total) {
      //   const message = getTranslation('your balances are not enough for this transaction', this.translate);
      //   return Swal.fire({ type: 'error', title: 'Oops...', text: message });
      // }
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
              console.log('here');

              this.generatedTxHash();
              this.multisigServ.update(this.multisig);
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
    // const { recipient, amount, fee, sender } = this.createTransactionForm.value;
    const multisig = { ...this.multisig };

    // multisig.sendMoney = { sender, amount, fee, recipient };
    multisig.txBody = this.createTransactionForm.value;
    this.multisigServ.update(multisig);
  }

  back() {
    this.location.back();
  }

  generatedTxHash() {
    // console.log(this.createTransactionForm.value);

    // const { sender, fee, nodePublicKey, nodeAddress, funds } = this.createTransactionForm.value;
    const { unisgnedTransactions, multisigInfo } = this.multisig;
    // const data: SendMoneyInterface = { sender, recipient, fee, amount };
    // this.multisig.unisgnedTransactions = this.multisigServ.createTxBytes(this.createTransactionForm.value, this.multisig.txType);
    // const data: UpdateNodeInterface = {
    //   accountAddress: sender,
    //   fee,
    //   nodePublicKey: ZBCAddressToBytes(nodePublicKey),
    //   nodeAddress,
    //   funds,
    // };
    // console.log(data);

    console.log(this.createTransactionForm.value, this.multisig.txType);

    if (unisgnedTransactions === null)
      this.multisig.unisgnedTransactions = createTxBytes(
        this.createTransactionForm.value,
        this.multisig.txType
      );

    console.log(this.multisig.unisgnedTransactions);

    if (this.multisig.signaturesInfo !== undefined) {
      const txHash = generateTransactionHash(this.multisig.unisgnedTransactions);
      const participants = multisigInfo.participants.map(address => ({
        address,
        signature: stringToBuffer(''),
      }));
      this.multisig.signaturesInfo = { txHash, participants };
    }
  }
}
