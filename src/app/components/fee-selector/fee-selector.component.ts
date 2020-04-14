import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Currency } from 'src/app/services/currency-rate.service';
import { environment } from 'src/environments/environment';
import { truncate } from 'src/helpers/utils';

@Component({
  selector: 'fee-selector',
  templateUrl: './fee-selector.component.html',
  styleUrls: ['./fee-selector.component.scss'],
})
export class FeeSelectorComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() feeName: string;
  @Input() feeCurrName: string;
  @Input() required: boolean;
  @Input() currencyRate: Currency;
  @Output() onToggleCustomFee = new EventEmitter();
  @Output() onClickFeeChoose = new EventEmitter();

  feeSlow = environment.fee;
  feeMedium = this.feeSlow * 2;
  feeFast = this.feeMedium * 2;
  activeButton: number = 2;
  kindFee: string;

  typeCoin = 'ZBC';
  typeFee = 'ZBC';

  customFee: boolean = false;

  constructor() {}

  ngOnInit() {}

  onChangeFeeField(value) {
    const fee = truncate(value, 8);
    const feeCurrency = fee * this.currencyRate.value;
    this.group.get(this.feeCurrName).patchValue(feeCurrency);
  }

  onChangeFeeCurrencyField(value) {
    const fee = value / this.currencyRate.value;
    const feeTrunc = truncate(fee, 8);
    this.group.get(this.feeName).patchValue(feeTrunc);
  }

  toggleCustomFee() {
    this.customFee = !this.customFee;
    if (!this.customFee) this.onFeeChoose(this.activeButton);
  }

  onFeeChoose(value) {
    let fee: number = 0;
    if (value === 1) {
      this.onClickFeeChoose.emit(value);
      fee = this.feeSlow;
      this.group.get(this.feeName).patchValue(fee);
      this.kindFee = 'Slow';
    } else if (value === 2) {
      this.onClickFeeChoose.emit(value);
      fee = this.feeMedium;
      this.kindFee = 'Average';
    } else {
      this.onClickFeeChoose.emit(value);
      fee = this.feeFast;
      this.kindFee = 'Fast';
    }

    const feeCurrency = fee * this.currencyRate.value;
    this.group.patchValue({
      fee: fee,
      feeCurr: feeCurrency,
    });
    this.activeButton = value;
  }
}
