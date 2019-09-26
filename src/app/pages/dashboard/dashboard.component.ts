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
import {
  GetAccountBalanceResponse,
  AccountBalance as AB,
} from 'src/app/grpc/model/accountBalance_pb';
import { AddAccountComponent } from '../add-account/add-account.component';
import { onCopyText } from 'src/helpers/utils';

type AccountBalance = AB.AsObject;
type AccountBalanceList = GetAccountBalanceResponse.AsObject;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  accountBalance: AccountBalance;
  isLoadingBalance: boolean = false;
  isLoadingRecentTx: boolean = false;

  isErrorBalance: boolean = false;
  isErrorRecentTx: boolean = false;

  totalTx: number = 0;
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
    private dialog: MatDialog
  ) {
    this.currAcc = this.authServ.getCurrAccount();
    this.address = this.authServ.currAddress;
    this.accounts = this.authServ.getAllAccount();
  }

  ngOnInit() {
    this.getBalance();
    this.getTransactions();

    this.getCurrencyRates();
    this.currencyRate = this.currencyServ.rate;
  }

  getBalance() {
    if (!this.isLoadingBalance) {
      this.isLoadingBalance = true;
      this.isErrorBalance = false;

      this.accountServ
        .getAccountBalance()
        .then((data: AccountBalanceList) => {
          this.accountBalance = data.accountbalance;
          this.isLoadingBalance = false;
        })
        .catch(() => {
          this.isErrorBalance = true;
          this.isLoadingBalance = false;
        });
    }
  }

  getTransactions() {
    if (!this.isLoadingRecentTx) {
      this.isLoadingRecentTx = true;
      this.isErrorRecentTx = false;

      this.transactionServ
        .getAccountTransaction(1, 5)
        .then((res: Transactions) => {
          this.totalTx = res.total;
          this.recentTx = res.transactions;
          this.isLoadingRecentTx = false;
        })
        .then(() => {
          this.transactionServ
            .getUnconfirmTransaction()
            .then((res: Transaction[]) => {
              this.unconfirmTx = res;
            });
        })
        .catch(() => {
          this.isErrorRecentTx = true;
          this.isLoadingRecentTx = false;
        });
    }
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

    // reload data balance, transaction, and unconfirm transaction
    this.getBalance();
    this.getTransactions();
  }

  copyText(text) {
    onCopyText(text);
    this.snackBar.open('Address Copied', null, { duration: 5000 });
  }

  onOpenAddAccount() {
    this.dialog.open(AddAccountComponent, {
      width: '360px',
    });
  }
}
