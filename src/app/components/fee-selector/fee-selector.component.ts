import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Currency } from 'src/app/services/currency-rate.service';
import { environment } from 'src/environments/environment';
import { truncate } from 'src/helpers/utils';

@Component({
  selector: 'fee-selector',
  templateUrl: './fee-selector.component.html',
  styleUrls: ['./fee-selector.component.scss'],
})
export class FeeSelectorComponent implements OnInit, OnChanges {
  @Input() group: FormGroup;
  @Input() feeName: string;
  @Input() feeCurrName: string;
  @Input() required: boolean;
  @Input() currencyRate: Currency;
  @Input() minFee: number;
  @Input() timeoutField: number;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.timeoutField) {
      this.feeSlow = this.minFee;
      this.feeMedium = this.feeSlow * 2;
      this.feeFast = this.feeMedium * 2;
      if (this.customFee == false) {
        let value: number = 0;
        switch (this.kindFee) {
          case 'Slow':
            value = this.feeSlow;
            break;
          case 'Fast':
            value = this.feeFast;
            break;
          default:
            value = this.feeMedium;
        }
        this.group.get(this.feeName).patchValue(value);
      }
    }
  }

  ngOnInit() {
    this.setDefaultFee();
  }

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
    if (this.customFee) {
      this.kindFee = 'Custom';
      this.onClickFeeChoose.emit(this.kindFee);
    } else {
      this.onFeeChoose(this.activeButton);
    }
  }

  onFeeChoose(value) {
    let fee: number = 0;
    if (value === 1) {
      fee = this.feeSlow;
      this.kindFee = 'Slow';
      this.onClickFeeChoose.emit(this.kindFee);
    } else if (value === 2) {
      fee = this.feeMedium;
      this.kindFee = 'Average';
      this.onClickFeeChoose.emit(this.kindFee);
    } else {
      fee = this.feeFast;
      this.kindFee = 'Fast';
      this.onClickFeeChoose.emit(this.kindFee);
    }

    const feeCurrency = fee * this.currencyRate.value;
    this.group.patchValue({
      fee: fee,
      feeCurr: feeCurrency,
    });
    this.activeButton = value;
  }

  setDefaultFee() {
    this.onFeeChoose(2);
  }
}
