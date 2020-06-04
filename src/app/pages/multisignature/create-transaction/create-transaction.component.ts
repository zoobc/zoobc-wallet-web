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
import { DomSanitizer } from '@angular/platform-browser';

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
  fileJson: any;
  isMultiSignature: boolean = false;

  constructor(
    private authServ: AuthService,
    private currencyServ: CurrencyRateService,
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private sanitizer: DomSanitizer
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
      if (multisig.unisgnedTransactions === undefined) this.router.navigate(['/multisignature']);

      this.multisig = multisig;

      if (multisig.unisgnedTransactions) {
        const { sender, recipient, amount, fee } = multisig.unisgnedTransactions;
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
    });
  }

  generateDownloadJsonUri() {
    this.updateCreateTransaction();
    let theJSON = JSON.stringify(this.multisig);
    let uri = this.sanitizer.bypassSecurityTrustUrl(
      'data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON)
    );
    this.fileJson = uri;
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

  next() {
    if (this.createTransactionForm.valid) {
      this.updateCreateTransaction();
      const { signaturesInfo } = this.multisig;
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
      } else {
        this.multisig = this.multisig;
      }
      if (signaturesInfo !== undefined) this.router.navigate(['/multisignature/add-signatures']);
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
}
