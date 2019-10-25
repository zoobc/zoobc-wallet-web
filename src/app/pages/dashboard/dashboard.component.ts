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
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

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

  totalTx: number;
  recentTx: Transaction[];
  unconfirmTx: Transaction[];

  currencyRate: Currency = {
    name: '',
    value: 0,
  };
  currencyRates: Currency[];

  currAcc: SavedAccount;
  accounts: SavedAccount[];

  zbcPriceInUsd: number = 10;

  constructor(
    private accountServ: AccountService,
    private authServ: AuthService,
    private transactionServ: TransactionService,
    private currencyServ: CurrencyRateService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private translate: TranslateService
  ) {
    this.currAcc = this.authServ.getCurrAccount();
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
        .getAccountBalance(this.currAcc.address)
        .then((data: AccountBalanceList) => {
          this.accountBalance = data.accountbalance;
          return this.authServ.getAccountsWithBalance();
        })
        .then((res: SavedAccount[]) => (this.accounts = res))
        .catch(() => (this.isErrorBalance = true))
        .finally(() => (this.isLoadingBalance = false));
    }
  }

  getTransactions() {
    if (!this.isLoadingRecentTx) {
      this.recentTx = null;
      this.unconfirmTx = null;

      this.isLoadingRecentTx = true;
      this.isErrorRecentTx = false;

      this.transactionServ
        .getAccountTransaction(1, 5, this.currAcc.address)
        .then((res: Transactions) => {
          this.recentTx = res.transactions;
          this.totalTx = res.total;
          return this.transactionServ.getUnconfirmTransaction(
            this.currAcc.address
          );
        })
        .then((unconfirmTx: Transaction[]) => (this.unconfirmTx = unconfirmTx))
        .catch(() => (this.isErrorRecentTx = true))
        .finally(() => (this.isLoadingRecentTx = false));
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
    this.router.navigateByUrl('/');
  }

  async copyText(text) {
    onCopyText(text);

    let message: string;
    await this.translate
      .get('Address copied to clipboard')
      .toPromise()
      .then(res => (message = res));
    Swal.fire('', message, 'success');
    this.snackBar.open(message, null, { duration: 5000 });
  }

  onOpenAddAccount() {
    this.dialog.open(AddAccountComponent, { width: '360px' });
  }
}
