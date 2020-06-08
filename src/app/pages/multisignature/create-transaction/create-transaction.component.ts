import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import { Subscription } from 'rxjs';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { truncate } from 'src/helpers/utils';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SendMoneyInterface, generateTransactionHash } from 'zoobc-sdk';
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
  kindFee: string;
  subscription: Subscription = new Subscription();
  account: SavedAccount;

  isCompleted = true;
  createTransactionForm: FormGroup;
  recipientForm = new FormControl('', Validators.required);
  amountForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  amountCurrencyForm = new FormControl('', Validators.required);
  feeForm = new FormControl(this.minFee * 2, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  timeoutField = new FormControl('');
  typeCoinField = new FormControl('ZBC');

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  feeSlow = environment.fee;
  feeMedium = this.feeSlow * 2;
  feeFast = this.feeMedium * 2;
  typeFee: number;
  customFeeValues: number;
  txHash: string;
  isMultiSignature: boolean = false;
  isHasTransactionHash: boolean = false;
  removeExport: boolean = false;

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
      recipient: this.recipientForm,
      amount: this.amountForm,
      amountCurrency: this.amountCurrencyForm,
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      timeout: this.timeoutField,
      typeCoin: this.typeCoinField,
    });
    this.account = authServ.getCurrAccount();
    this.isMultiSignature = this.account.type == 'multisig' ? true : false;
  }

  ngOnInit() {
    // Currency Subscriptions
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;

      const minCurrency = truncate(this.minFee * rate.value, 8);

      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
      this.amountCurrencyForm.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);
    // Multisignature Subscription
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
      if (unisgnedTransactions === undefined) this.router.navigate(['/multisignature']);

      this.multisig = multisig;
      this.removeExport = this.multisig.signaturesInfo !== undefined ? true : false;
      if (signaturesInfo) {
        this.isHasTransactionHash = this.multisig.signaturesInfo.txHash !== undefined ? true : false;
      }
      if (this.isHasTransactionHash) this.createTransactionForm.disable();

      if (unisgnedTransactions) {
        const { sender, recipient, amount, fee } = unisgnedTransactions;
        this.account.address = sender;
        this.recipientForm.setValue(recipient);
        this.amountForm.setValue(amount);
        this.amountCurrencyForm.setValue(amount * this.currencyRate.value);
        this.feeForm.setValue(fee);
        this.feeFormCurr.setValue(fee * this.currencyRate.value);
        this.timeoutField.setValue('0');
        if (fee === this.feeSlow) {
          this.typeFee = 1;
        } else if (fee === this.feeMedium) {
          this.typeFee = 2;
        } else if (fee === this.feeFast) {
          this.typeFee = 3;
        } else {
          this.customFeeValues = fee;
        }
      } else if (this.isMultiSignature) this.multisig.generatedSender = this.account.address;

      this.stepper.multisigInfo = multisigInfo !== undefined ? true : false;
      this.stepper.signatures = signaturesInfo !== undefined ? true : false;
    });
  }

  async generateDownloadJsonUri() {
    if (!this.isHasTransactionHash) {
      let title;
      await this.translate
        .get('Are you sure?')
        .toPromise()
        .then(res => (title = res));
      let message;
      await this.translate
        .get('You will not be able to update the form anymore!')
        .toPromise()
        .then(res => (message = res));
      let buttonText;
      await this.translate
        .get('Yes, continue it!')
        .toPromise()
        .then(res => (buttonText = res));
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
          const url = window.URL.createObjectURL(blob);
          saveAs(blob, 'Multisignature-Draft.json');
        }
      });
    } else {
      let theJSON = JSON.stringify(this.multisig);
      const blob = new Blob([theJSON], { type: 'application/JSON' });
      const url = window.URL.createObjectURL(blob);
      saveAs(blob, 'Multisignature-Draft.json');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.multisigSubs.unsubscribe();
  }

  onClickFeeChoose(value) {
    this.kindFee = value;
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
  }

  async next() {
    if (this.multisig.signaturesInfo !== null) this.createTransactionForm.enable();
    if (this.createTransactionForm.valid) {
      this.updateCreateTransaction();
      const { signaturesInfo } = this.multisig;
      if (signaturesInfo === null) {
        if (!this.isHasTransactionHash) {
          let title;
          await this.translate
            .get('Are you sure?')
            .toPromise()
            .then(res => (title = res));
          let message;
          await this.translate
            .get('You will not be able to update the form anymore!')
            .toPromise()
            .then(res => (message = res));
          let buttonText;
          await this.translate
            .get('Yes, continue it!')
            .toPromise()
            .then(res => (buttonText = res));
          Swal.fire({
            title: title,
            text: message,
            showCancelButton: true,
            confirmButtonText: buttonText,
            type: 'warning',
          }).then(result => {
            if (result.value) {
              this.generatedTxHash();
              this.router.navigate(['/multisignature/add-signatures']);
            }
          });
        }
      } else if (signaturesInfo !== undefined) this.router.navigate(['/multisignature/add-signatures']);
      else this.router.navigate(['/multisignature/send-transaction']);
    }
    console.log(this.multisig);
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

    multisig.unisgnedTransactions = {
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
    const { amount, fee, recipient, sender } = this.multisig.unisgnedTransactions;
    const data: SendMoneyInterface = {
      sender: sender,
      recipient: recipient,
      fee: fee,
      amount: amount,
    };
    const accounts = this.authServ.getAllAccount();
    const account = accounts.find(acc => acc.address == sender);
    let participantAccount = [];
    if (this.multisig.signaturesInfo == null) {
      if (account) {
        for (let i = 0; i < account.participants.length; i++) {
          let participant = {
            address: account.participants[i],
            signatures: null,
          };
          participantAccount.push(participant);
        }
      } else {
        for (let i = 0; i < this.multisig.multisigInfo.participants.length; i++) {
          let participant = {
            address: this.multisig.multisigInfo.participants[i],
            signature: null,
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
      this.multisig.generatedSender = this.multisig.unisgnedTransactions.sender;
    }
  }
}
