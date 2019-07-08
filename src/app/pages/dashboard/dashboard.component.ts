import { Component, OnInit } from '@angular/core';

import {
  AccountService,
  SavedAccount,
  Account,
} from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { AppService } from 'src/app/app.service';
import {
  Currency,
  CurrencyRateService,
} from 'src/app/services/currency-rate.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  accountBalance: Account;
  showSpinnerBalance: boolean = true;
  showSpinnerRecentTx: boolean = true;

  accountBalanceServ: any;
  getAccountBalanceReq: any;
  recentTx: any[];

  currencyRate: Currency = {
    name: '',
    value: 0,
  };

  account: SavedAccount;
  address: string;

  currencyRates: Currency[];
  zbcPriceInUsd: number = 10;

  constructor(
    private accountServ: AccountService,
    private transactionServ: TransactionService,
    private appServ: AppService,
    private currencyServ: CurrencyRateService,
    private snackBar: MatSnackBar
  ) {
    this.account = accountServ.getCurrAccount();
    this.address = accountServ.currAddress;
  }

  ngOnInit() {
    window.scroll(0, 0);

    this.accountServ.getAccountBalance().then((data: Account) => {
      this.accountBalance = data;
      this.showSpinnerBalance = false;
    });

    this.transactionServ.getAccountTransaction().then((res: any) => {
      this.recentTx = res.transactionsList;
      this.recentTx = this.recentTx.slice(0, 5);
      this.showSpinnerRecentTx = false;
    });

    this.currencyServ.currencyRate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });

    this.getCurrencyRates();
    this.currencyRate = this.currencyServ.rate;
  }

  getCurrencyRates() {
    this.currencyServ.getCurrencyRate().subscribe((res: any) => {
      let rates = Object.keys(res.rates).map(currencyName => {
        let rate = {
          name: currencyName,
          value: res.rates[currencyName] * this.zbcPriceInUsd,
        };
        if (this.currencyRate.name == currencyName)
          this.currencyRate.value = rate.value;
        return rate;
      });
      rates.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
      });

      this.currencyRates = rates;
    });
  }

  onChangeRate(rate) {
    this.currencyServ.onChangeRate(rate);
    this.currencyRate = rate;
  }

  copyText(text) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackBar.open('Address Copied', null, { duration: 5000 });
  }
}
