import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { Currency } from 'src/app/services/currency-rate.service';
import { FormGroup, FormControl } from '@angular/forms';
import { truncate } from 'src/helpers/utils';

@Component({
  selector: 'input-amount',
  templateUrl: './input-amount.component.html',
  styleUrls: ['./input-amount.component.scss'],
})
export class InputAmountComponent implements OnInit {
  @Input() currencyRate: Currency;
  @Input() label: String;
  @Input() displayConverter: boolean;
  @Input() group: FormGroup;
  @Input() typeCoinName: string;
  @Input() amountName: string;
  @Input() amountCurrencyName: string;

  constructor() {}

  ngOnInit() {}

  onChangeAmountField(value: any) {
    const amount = truncate(value, 8);
    const amountCurrency = amount * this.currencyRate.value;
    this.group.get(this.amountCurrencyName).patchValue(amountCurrency);
  }

  onChangeAmountCurrencyField(value: any) {
    const amount = value / this.currencyRate.value;
    const amountTrunc = truncate(amount, 8);
    this.group.get(this.amountName).patchValue(amountTrunc);
  }
}
