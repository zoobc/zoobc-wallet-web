import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import {
  Currency,
  CurrencyRateService,
} from 'src/app/services/currency-rate.service';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { AddAccountComponent } from '../account/add-account/add-account.component';
import { Router } from '@angular/router';
import { EditAccountComponent } from '../account/edit-account/edit-account.component';

import zoobc, {
  TransactionListParams,
  toTransactionListWallet,
  getZBCAdress,
  MempoolListParams,
} from 'zoobc-sdk';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  subscription: Subscription = new Subscription();

  accountBalance: any;
  isLoadingBalance: boolean = false;
  isLoadingRecentTx: boolean = false;

  isErrorBalance: boolean = false;
  isErrorRecentTx: boolean = false;

  totalTx: number;
  recentTx: any;
  unconfirmTx: any;

  currencyRate: Currency;
  currencyRates: Currency[];

  currAcc: SavedAccount;
  accounts: SavedAccount[];

  constructor(
    private authServ: AuthService,
    private currencyServ: CurrencyRateService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.currAcc = this.authServ.getCurrAccount();

    this.getBalance();
    this.getTransactions();

    const subsRate = this.currencyServ.rate.subscribe(
      rate => (this.currencyRate = rate)
    );
    this.subscription.add(subsRate);
    this.currencyServ
      .getRates()
      .then(rates => (this.currencyRates = rates))
      .catch(err => console.log(err));
  }

  ngOnInit() {
    if (history.state.loadAccount) this.reloadAccount();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async reloadAccount() {
    const keyring = this.authServ.keyring;

    let accountName: string = 'Account ';
    let accountNo: number = 1;
    let accountPath: number = 0;
    let publicKey: Uint8Array;
    let address: string;
    let accountsTemp = [];
    let accounts = [];

    let counter: number = 0;

    while (counter < 20) {
      const childSeed = keyring.calcDerivationPath(accountPath);

      publicKey = childSeed.publicKey;
      address = getZBCAdress(publicKey);
      const account = {
        name: accountName + accountNo,
        path: accountPath,
        nodeIP: null,
        address: address,
      };
      const params: TransactionListParams = {
        address: address,
        transactionType: 1,
        pagination: {
          page: 1,
          limit: 1,
        },
      };
      await zoobc.Transactions.getList(params).then(res => {
        const tx = toTransactionListWallet(res, address);
        const totalTx = parseInt(res.total);
        accountsTemp.push(account);
        if (totalTx > 0) {
          Array.prototype.push.apply(accounts, accountsTemp);
          this.authServ.restoreAccount(accounts);
          accountsTemp = [];
          counter = 0;
        }
      });
      accountPath++;
      accountNo++;
      counter++;
    }
    this.accounts = accounts;
    // load balance
    zoobc.Account.getBalance(this.currAcc.address)
      .then(() => {
        return this.authServ.getAccountsWithBalance();
      })
      .then((res: SavedAccount[]) => (this.accounts = res));
  }

  getBalance() {
    if (!this.isLoadingBalance) {
      this.isLoadingBalance = true;
      this.isErrorBalance = false;

      zoobc.Account.getBalance(this.currAcc.address)
        .then(data => {
          this.accountBalance = data.accountbalance;
          return this.authServ.getAccountsWithBalance();
        })
        .then((res: SavedAccount[]) => (this.accounts = res))
        .catch(e => {
          this.isErrorBalance = true;
        })
        .finally(() => (this.isLoadingBalance = false));
    }
  }

  getTransactions() {
    if (!this.isLoadingRecentTx) {
      this.recentTx = null;
      this.unconfirmTx = null;

      this.isLoadingRecentTx = true;
      this.isErrorRecentTx = false;

      const params: TransactionListParams = {
        address: this.currAcc.address,
        transactionType: 1,
        pagination: {
          page: 1,
          limit: 5,
        },
      };

      zoobc.Transactions.getList(params)
        .then(res => {
          const tx = toTransactionListWallet(res, this.currAcc.address);
          this.recentTx = tx.transactions;
          this.totalTx = tx.total;
          const params: MempoolListParams = {
            address: this.currAcc.address,
          };
          return zoobc.Mempool.getList(params);
        })
        .then(unconfirmTx => (this.unconfirmTx = unconfirmTx))
        .catch(e => {
          this.isErrorRecentTx = true;
        })
        .finally(() => (this.isLoadingRecentTx = false));
    }
  }

  onChangeRate(rate) {
    this.currencyServ.updateRate(rate);
  }

  onSwitchAccount(account: SavedAccount) {
    this.authServ.switchAccount(account);
    this.router.navigateByUrl('/');
  }

  onOpenAddAccount() {
    this.dialog.open(AddAccountComponent, { width: '360px' });
  }

  onOpenEditAccount(e, account: SavedAccount) {
    e.stopPropagation();
    const dialog = this.dialog.open(EditAccountComponent, {
      width: '360px',
      data: account,
    });
    dialog.afterClosed().subscribe((edited: boolean) => {
      if (edited) {
        this.accounts = this.authServ.getAllAccount();
        this.currAcc = this.authServ.getCurrAccount();
      }
    });
  }
}
