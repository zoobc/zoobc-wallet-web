import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import { Subscription } from 'rxjs';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { truncate } from 'src/helpers/utils';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss'],
})
export class CreateTransactionComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  minFee = environment.fee;
  currencyRate: Currency;
  kindFee: string;
  subscription: Subscription = new Subscription();
  account: SavedAccount;

  isCompleted = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  recipientForm = new FormControl('', Validators.required);
  amountForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  amountCurrencyForm = new FormControl('', Validators.required);
  feeForm = new FormControl(this.minFee * 2, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  timeoutField = new FormControl('', [Validators.required, Validators.min(1)]);
  typeCoinField = new FormControl('ZBC');

  constructor(private authServ: AuthService, private currencyServ: CurrencyRateService) {
    this.secondFormGroup = new FormGroup({
      recipient: this.recipientForm,
      amount: this.amountForm,
      amountCurrency: this.amountCurrencyForm,
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      timeout: this.timeoutField,
      typeCoin: this.typeCoinField,
    });
  }

  ngOnInit() {
    this.stepper.selectedIndex = 1;
    this.account = this.authServ.getCurrAccount();
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;

      const minCurrency = truncate(this.minFee * rate.value, 8);

      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
      this.amountCurrencyForm.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClickFeeChoose(value) {
    this.kindFee = value;
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
  }
}
