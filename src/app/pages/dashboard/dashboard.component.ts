import { Component, OnInit } from '@angular/core';

import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { AppService } from 'src/app/app.service';
import {
  currency,
  CurrencyRateService,
} from 'src/app/services/currency-rate.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  accountBalance;
  showSpinnerBalance: boolean = true;
  showSpinnerRecentTx: boolean = true;

  accountBalanceServ: any;
  getAccountBalanceReq: any;
  recentTx: any[];

  currencyRate: currency;

  constructor(
    private accountServ: AccountService,
    private transactionServ: TransactionService,
    private appServ: AppService,
    private currencyServ: CurrencyRateService
  ) {}

  ngOnInit() {
    window.scroll(0, 0);

    this.accountServ.getAccountBalance().then(data => {
      this.accountBalance = data;
      this.showSpinnerBalance = false;
    });

    this.transactionServ.getAccountTransaction().then((res: any) => {
      this.recentTx = res.transactionsList;
      this.recentTx = this.recentTx.slice(0, 4);
      this.showSpinnerRecentTx = false;
    });

    this.currencyServ.currencyRate.subscribe((rate: currency) => {
      this.currencyRate = rate;
    });
  }
}
