import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface Currency {
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyRateService {
  private sourceCurrencyRate = new BehaviorSubject({});
  currencyRate = this.sourceCurrencyRate.asObservable();
  rate: Currency;

  constructor(private http: HttpClient) {
    let rates = JSON.parse(localStorage.getItem('rate'));
    // if local storage doesnt set the rate yet
    if (!rates) rates = { name: 'USD', value: 0 };

    this.sourceCurrencyRate.next(rates);

    this.currencyRate.subscribe((res: Currency) => (this.rate = res));
  }

  getCurrencyRate() {
    return this.http.get('https://api.exchangeratesapi.io/latest?base=USD');
  }

  onChangeRate(rate: Currency) {
    this.sourceCurrencyRate.next(rate);
    localStorage.setItem('rate', JSON.stringify(rate));
  }
}
