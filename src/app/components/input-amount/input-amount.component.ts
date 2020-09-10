import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import { FormGroup, FormControl } from '@angular/forms';
import { truncate } from 'src/helpers/utils';

@Component({
  selector: 'input-amount',
  templateUrl: './input-amount.component.html',
  styleUrls: ['./input-amount.component.scss'],
})
export class InputAmountComponent implements OnInit {
  @Input() currencyRate: Currency;
  currencyRate2: Currency;
  @Input() label: String;
  @Input() displayConverter: boolean;
  @Input() group: FormGroup;
  typeCoinName: string = 'ZBC';
  @Input() amountName: string;
  @Input() amountCurrencyName: string;
  amountCurrency: number;

  constructor(private currencyServ: CurrencyRateService) {}

  ngOnInit() {
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      console.log(rate);

      this.currencyRate2 = rate;
    });
  }

  onChangeCoin(value) {
    console.log(value);

    this.typeCoinName = value;
    const amount = this.group.get(this.amountName).value;
    this.onChangeAmountField(amount);
  }

  onChangeAmountField(value: number) {
    const amount = truncate(value, 8);
    this.amountCurrency = truncate(amount * this.currencyRate2.value, 4);
    // this.group.get(this.amountCurrencyName).patchValue(amountCurrency);
  }

  onChangeAmountCurrencyField(value: any) {
    this.amountCurrency = value;
    const amount = ((value / this.currencyRate2.value) * 1e8) / 1e8;
    const amountTrunc = truncate(amount, 8);
    this.group.get(this.amountName).patchValue(amountTrunc);
  }
}
