import { Component, OnInit, Input } from '@angular/core';
import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import { FormGroup } from '@angular/forms';
import { truncate } from 'src/helpers/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'input-amount',
  templateUrl: './input-amount.component.html',
  styleUrls: ['./input-amount.component.scss'],
})
export class InputAmountComponent implements OnInit {
  @Input() label: String;
  @Input() displayConverter: boolean = true;
  @Input() group: FormGroup;
  @Input() amountName: string;

  amountCurrency: number;
  typeCoinName: string = 'ZBC';
  currencyRate: Currency;
  subsRate: Subscription;

  constructor(private currencyServ: CurrencyRateService) {}

  ngOnInit() {
    this.subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });
  }

  ngOnDestroy() {
    if (this.subsRate) this.subsRate.unsubscribe();
  }

  onChangeCoin(value) {
    this.typeCoinName = value;
    const amount = this.group.get(this.amountName).value;
    this.onChangeAmountField(amount);
  }

  onChangeAmountField(value: number) {
    const amount = truncate(value, 8);
    this.amountCurrency = truncate(amount * this.currencyRate.value, 4);
  }

  onChangeAmountCurrencyField(value: any) {
    this.amountCurrency = value;
    const amount = ((value / this.currencyRate.value) * 1e8) / 1e8;
    const amountTrunc = truncate(amount, 8);
    this.group.get(this.amountName).patchValue(amountTrunc);
  }
}
