import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  CurrencyRateService,
  Currency,
} from 'src/app/services/currency-rate.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from 'src/environments/environment';
import { truncate, calcMinFee } from 'src/helpers/utils';

@Component({
  selector: 'app-fee-selector',
  templateUrl: './fee-selector.component.html',
  styleUrls: ['./fee-selector.component.scss'],
})
export class FeeSelectorComponent implements OnInit {
  currencyRate: Currency;

  feeSlow = environment.fee;
  feeMedium = this.feeSlow * 5;
  feeFast = this.feeMedium * 5;
  activeButton: number = 2;
  kindFee: string;

  formSend: FormGroup;
  recipientForm = new FormControl('', Validators.required);
  amountForm = new FormControl('', [
    Validators.required,
    Validators.min(1 / 1e8),
  ]);
  amountCurrencyForm = new FormControl('', Validators.required);
  feeForm = new FormControl(this.feeMedium, [
    Validators.required,
    Validators.min(this.feeSlow),
  ]);
  feeFormCurr = new FormControl('', Validators.required);
  aliasField = new FormControl('', Validators.required);
  addressApproverField = new FormControl('', Validators.required);
  approverCommissionField = new FormControl('', [
    Validators.required,
    Validators.min(1 / 1e8),
  ]);
  approverCommissionCurrField = new FormControl('', [
    Validators.required,
    Validators.min(1 / 1e8),
  ]);
  instructionField = new FormControl('', Validators.required);
  timeoutField = new FormControl('', [Validators.required, Validators.min(1)]);

  typeCoin = 'ZBC';
  typeFee = 'ZBC';
  typeCommission = 'ZBC';

  customFee: boolean = false;
  advancedMenu: boolean = false;

  constructor(
    private currencyServ: CurrencyRateService,
    public dialog: MatDialog
  ) {
    // disable alias field (saveAddress = false)
    this.aliasField.disable();
  }

  ngOnInit() {}

  onChangeAmountField() {
    const amount = truncate(this.amountForm.value, 8);
    const amountCurrency = amount * this.currencyRate.value;
    this.amountCurrencyForm.patchValue(amountCurrency);
  }

  onChangeAmountCurrencyField() {
    const amount = this.amountCurrencyForm.value / this.currencyRate.value;
    const amountTrunc = truncate(amount, 8);
    this.amountForm.patchValue(amountTrunc);
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
