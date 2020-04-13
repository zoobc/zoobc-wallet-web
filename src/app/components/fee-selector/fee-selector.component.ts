import { Component, OnInit, forwardRef } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  CurrencyRateService,
  Currency,
} from 'src/app/services/currency-rate.service';
import { MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';
import { truncate } from 'src/helpers/utils';

@Component({
  selector: 'fee-selector',
  templateUrl: './fee-selector.component.html',
  styleUrls: ['./fee-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FeeSelectorComponent),
      multi: true,
    },
  ],
})
export class FeeSelectorComponent implements OnInit, ControlValueAccessor {
  subscription: Subscription = new Subscription();

  currencyRate: Currency;

  value: number;
  disabled: boolean;

  feeSlow = environment.fee;
  feeMedium = this.feeSlow * 2;
  feeFast = this.feeMedium * 2;
  activeButton: number = 2;
  kindFee: string;

  formSend: FormGroup;

  feeForm = new FormControl(this.feeMedium, [
    Validators.required,
    Validators.min(this.feeSlow),
  ]);
  feeFormCurr = new FormControl('', Validators.required);

  typeCoin = 'ZBC';
  typeFee = 'ZBC';

  customFee: boolean = false;

  private _onChange = (value: any) => {};
  private _onTouched = (value: any) => {};

  constructor(
    private currencyServ: CurrencyRateService,
    public dialog: MatDialog
  ) {
    this.formSend = new FormGroup({
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
    });
  }

  writeValue(value: any): void {
    this.value = value ? value : '';
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      // set default fee to medium
      this.onChangeFeeField();
      // convert fee to current currency
      this.onFeeChoose(2);

      const minCurrency = truncate(this.feeSlow * rate.value, 8);

      this.feeFormCurr.setValidators([
        Validators.required,
        Validators.min(minCurrency),
      ]);
    });

    this.subscription.add(subsRate);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChangeFee(value: any) {
    this.feeForm.patchValue(value);
    this.onChangeFeeField();
  }

  onChangeFeeCurr(value: any) {
    this.feeForm.patchValue(value);
    this.onChangeFeeCurrencyField();
  }

  onChangeFeeField() {
    const fee = truncate(this.feeForm.value, 8);
    const feeCurrency = fee * this.currencyRate.value;
    this.feeFormCurr.patchValue(feeCurrency);
  }

  onChangeFeeCurrencyField() {
    const fee = this.feeFormCurr.value / this.currencyRate.value;
    const feeTrunc = truncate(fee, 8);
    this.feeForm.patchValue(feeTrunc);
  }

  toggleCustomFee() {
    this.customFee = !this.customFee;
    if (!this.customFee) this.onFeeChoose(this.activeButton);
  }

  onFeeChoose(value) {
    let fee: number = 0;
    if (value === 1) {
      fee = this.feeSlow;
      this.kindFee = 'Slow';
    } else if (value === 2) {
      fee = this.feeMedium;
      this.kindFee = 'Average';
    } else {
      fee = this.feeFast;
      this.kindFee = 'Fast';
    }

    const feeCurrency = fee * this.currencyRate.value;
    this.formSend.patchValue({
      fee: fee,
      feeCurr: feeCurrency,
    });
    this.activeButton = value;
  }
}
