import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

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
import { AddAccountComponent } from '../account/add-account/add-account.component';
import { getAddressFromPublicKey } from 'src/helpers/utils';
import { Router } from '@angular/router';
import { EditAccountComponent } from '../account/edit-account/edit-account.component';
import { KeyringService } from 'src/app/services/keyring.service';

import zoobc, {
  TransactionListParams,
  HostInterface,
  toTransactionListWallet,
} from 'zoobc-sdk';

type AccountBalance = AB.AsObject;
type AccountBalanceList = GetAccountBalanceResponse.AsObject;

const coin = 'ZBC';
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
    private dialog: MatDialog,
    private router: Router,
    private keyringServ: KeyringService
  ) {
    this.currAcc = this.authServ.getCurrAccount();
    this.getBalance();
    this.getTransactions();
    this.getCurrencyRates();
    this.currencyRate = this.currencyServ.rate;
  }

  async ngOnInit() {
    const list: HostInterface[] = [
      {
        host: 'http://85.90.246.90:8002',
        name: 'Network 1',
      },
      {
        host: 'Network 2',
        name: 'http://45.79.39.58:8002',
      },
    ];

    zoobc.Network.list(list);
    zoobc.Network.set(0);

    if (history.state.loadAccount) {
      await this.reloadAccount();
    } else {
      this.getBalance();
      this.getTransactions();

      this.getCurrencyRates();
      this.currencyRate = this.currencyServ.rate;
    }
  }

  async reloadAccount() {
    let accountName: string = 'Account ';
    let accountNo: number = 1;
    let accountPath: number = 0;
    let publicKey: Uint8Array;
    let address: string;
    let accountsTemp = [];
    let accounts = [];

    let counter: number = 0;
    while (counter < 20) {
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(
        coin,
        accountPath
      );

      publicKey = childSeed.publicKey;
      address = getAddressFromPublicKey(publicKey);

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

      // await this.transactionServ
      //   .getTransactions(1, 1, address)
      //   .then((res: Transactions) => {
      //     console.log(res);
      //     const totalTx = res.total;
      //     accountsTemp.push(account);
      //     if (totalTx > 0) {
      //       Array.prototype.push.apply(accounts, accountsTemp);
      //       this.authServ.restoreAccount(accounts);
      //       accountsTemp = [];
      //       counter = 0;
      //     }
      //   });

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
    this.accountServ
      .getAccountBalance(this.currAcc.address)
      .then((data: AccountBalanceList) => {
        return this.authServ.getAccountsWithBalance();
      })
      .then((res: SavedAccount[]) => (this.accounts = res));
  }

  getBalance() {
    if (!this.isLoadingBalance) {
      this.isLoadingBalance = true;
      this.isErrorBalance = false;

      // this.accountServ
      //   .getAccountBalance(this.currAcc.address)
      //   .then((data: AccountBalanceList) => {
      //     this.accountBalance = data.accountbalance;
      //     return this.authServ.getAccountsWithBalance();
      //   })
      //   .then((res: SavedAccount[]) => (this.accounts = res))
      //   .catch(() => (this.isErrorBalance = true))
      //   .finally(() => (this.isLoadingBalance = false));

      zoobc.Account.getBalance(this.currAcc.address)
        .then((data: AccountBalanceList) => {
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

      // this.transactionServ
      //   .getTransactions(1, 5, this.currAcc.address)
      //   .then((res: Transactions) => {
      //     this.recentTx = res.transactions;
      //     this.totalTx = res.total;
      //     return this.transactionServ.getUnconfirmTransaction(
      //       this.currAcc.address
      //     );
      //   })
      //   .then((unconfirmTx: Transaction[]) => (this.unconfirmTx = unconfirmTx))
      //   .catch(() => (this.isErrorRecentTx = true))
      //   .finally(() => (this.isLoadingRecentTx = false));

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
          this.recentTx = <Transaction[]>tx.transactions;
          this.totalTx = tx.total;
          return this.transactionServ.getUnconfirmTransaction(
            this.currAcc.address
          );
        })
        .then((unconfirmTx: Transaction[]) => (this.unconfirmTx = unconfirmTx))
        .catch(e => {
          this.isErrorRecentTx = true;
        })
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
