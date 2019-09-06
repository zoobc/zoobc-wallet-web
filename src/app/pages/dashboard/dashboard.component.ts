import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';

import { AccountService } from '../../services/account.service';
import {
  TransactionService,
  Transaction,
  Transactions,
} from '../../services/transaction.service';
import {
  Currency,
  CurrencyRateService,
} from 'src/app/services/currency-rate.service';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { ReceiveComponent } from '../receive/receive.component';
import {
  GetAccountBalanceResponse,
  AccountBalance as AB,
} from 'src/app/grpc/model/accountBalance_pb';
import { Router } from '@angular/router';
import { AddAccountComponent } from '../add-account/add-account.component';

type AccountBalance = AB.AsObject;
type AccountBalanceList = GetAccountBalanceResponse.AsObject;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  accountBalance: AccountBalance;
  showSpinnerBalance: boolean = true;
  showSpinnerRecentTx: boolean = true;

  recentTx: Transaction[];
  unconfirmTx: Transaction[];

  currencyRate: Currency = {
    name: '',
    value: 0,
  };
  currencyRates: Currency[];

  currAcc: SavedAccount;
  accounts: [SavedAccount];
  address: string;

  zbcPriceInUsd: number = 10;

  constructor(
    private accountServ: AccountService,
    private authServ: AuthService,
    private transactionServ: TransactionService,
    private currencyServ: CurrencyRateService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.currAcc = this.authServ.getCurrAccount();
    this.address = this.authServ.currAddress;
    this.accounts = this.authServ.getAllAccount();
  }

  ngOnInit() {
    window.scroll(0, 0);

    this.accountServ.getAccountBalance().then((data: AccountBalanceList) => {
      this.accountBalance = data.accountbalance;
      this.showSpinnerBalance = false;
    });

    this.transactionServ
      .getAccountTransaction(1, 5)
      .then((res: Transactions) => {
        this.recentTx = res.transactions;
        this.showSpinnerRecentTx = false;
      });

    this.transactionServ
      .getUnconfirmTransaction()
      .then((res: Transaction[]) => (this.unconfirmTx = res));

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


  onSwitchAccount(account: SavedAccount) {
    this.authServ.switchAccount(account);
    this.currAcc = this.authServ.getCurrAccount();
    this.address = this.authServ.currAddress;
    this.showSpinnerBalance = true;
    this.showSpinnerRecentTx = true;

    // reload data balance, transaction, and unconfirm transaction
    this.accountServ.getAccountBalance().then((data: AccountBalanceList) => {
      this.accountBalance = data.accountbalance;
      this.showSpinnerBalance = false;
    });

    this.transactionServ
      .getAccountTransaction(1, 5)
      .then((res: Transactions) => {
        this.recentTx = res.transactions;
        this.showSpinnerRecentTx = false;
      });

    this.transactionServ
      .getUnconfirmTransaction()
      .then((res: Transaction[]) => (this.unconfirmTx = res));
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

  openReceiveForm() {
    this.dialog.open(ReceiveComponent, {
      width: '480px',
    });
  }
  onOpenAddAccount() {
    this.dialog.open(AddAccountComponent, {
      width: '360px',
    });
  }
}
