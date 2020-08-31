import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { AddAccountComponent } from '../account/add-account/add-account.component';
import { Router } from '@angular/router';
import { EditAccountComponent } from '../account/edit-account/edit-account.component';

import zoobc, {
  TransactionListParams,
  toTransactionListWallet,
  MempoolListParams,
  toUnconfirmedSendMoneyWallet,
  AccountBalanceResponse,
  TransactionsResponse,
  TransactionType,
} from 'zoobc-sdk';
import { Subscription } from 'rxjs';
import { ContactService } from 'src/app/services/contact.service';
import { ReceiveComponent } from '../receive/receive.component';

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
  lastRefresh: number;
  lastRefreshAccount: number;

  constructor(
    private authServ: AuthService,
    private currencyServ: CurrencyRateService,
    private dialog: MatDialog,
    private router: Router,
    private contactServ: ContactService
  ) {
    this.currAcc = this.authServ.getCurrAccount();

    this.getBalance();
    this.getTransactions();

    const subsRate = this.currencyServ.rate.subscribe(rate => (this.currencyRate = rate));
    this.subscription.add(subsRate);
    this.currencyServ
      .getRates()
      .then(rates => (this.currencyRates = rates))
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.authServ.restoreAccounts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getBalance() {
    if (!this.isLoadingBalance) {
      this.isLoadingBalance = true;
      this.isErrorBalance = false;

      zoobc.Account.getBalance(this.currAcc.address)
        .then((data: AccountBalanceResponse) => {
          this.accountBalance = data.accountbalance;
          return this.authServ.getAccountsWithBalance();
        })
        .then((res: SavedAccount[]) => (this.accounts = res))
        .catch(e => {
          this.isErrorBalance = true;
        })
        .finally(() => ((this.isLoadingBalance = false), (this.lastRefreshAccount = Date.now())));
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
        transactionType: TransactionType.SENDMONEYTRANSACTION,
        pagination: {
          page: 1,
          limit: 5,
        },
      };

      zoobc.Transactions.getList(params)
        .then((res: TransactionsResponse) => {
          const tx = toTransactionListWallet(res, this.currAcc.address);
          this.recentTx = tx.transactions;
          this.recentTx.map(recent => {
            recent['alias'] = this.contactServ.get(recent.address).name || '';
          });
          this.totalTx = tx.total;

          const params: MempoolListParams = {
            address: this.currAcc.address,
          };
          return zoobc.Mempool.getList(params);
        })
        .then(
          unconfirmTx => (this.unconfirmTx = toUnconfirmedSendMoneyWallet(unconfirmTx, this.currAcc.address))
        )
        .catch(e => {
          this.isErrorRecentTx = true;
        })
        .finally(() => ((this.isLoadingRecentTx = false), (this.lastRefresh = Date.now())));
    }
  }

  openReceiveForm() {
    this.dialog.open(ReceiveComponent, { width: '480px' });
  }

  onChangeRate(rate) {
    this.currencyServ.updateRate(rate);
  }

  onSwitchAccount(account: SavedAccount) {
    this.authServ.switchAccount(account);
    this.router.navigateByUrl('/');
  }

  onOpenAddAccount() {
    const dialog = this.dialog.open(AddAccountComponent, { width: '360px', maxHeight: '99vh' });

    dialog.afterClosed().subscribe((added: boolean) => {
      if (added) {
        this.authServ.getAccountsWithBalance().then(accounts => (this.accounts = accounts));
        this.currAcc = this.authServ.getCurrAccount();
        this.getBalance();
        this.getTransactions();
      }
    });
  }

  onOpenEditAccount(e, account: SavedAccount) {
    e.stopPropagation();
    const dialog = this.dialog.open(EditAccountComponent, {
      width: '360px',
      maxHeight: '99vh',
      data: account,
    });
    dialog.afterClosed().subscribe((account: SavedAccount) => {
      if (account) {
        this.currAcc = account;
        this.authServ.getAccountsWithBalance().then(accounts => (this.accounts = accounts));
      }
    });
  }

  reloadBalanceTx() {
    this.getBalance();
    this.getTransactions();
  }
}
