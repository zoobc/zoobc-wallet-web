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
  TransactionType,
  EscrowListParams,
  OrderBy,
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
  startMatch: number = 0;
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

  async getTransactions() {
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

      try {
        const trxList = await zoobc.Transactions.getList(params);

        let lastHeight = 0;
        let firstHeight = 0;
        if (parseInt(trxList.total) > 0) {
          lastHeight = trxList.transactionsList[0].height;
          firstHeight = trxList.transactionsList[trxList.transactionsList.length - 1].height;
        }

        const multisigTx = trxList.transactionsList
          .filter(trx => trx.multisigchild == true)
          .map(trx => trx.id);

        const paramEscrow: EscrowListParams = {
          blockHeightStart: firstHeight,
          blockHeightEnd: lastHeight,
          recipient: this.currAcc.address,
          statusList: [0, 1, 2, 3],
          latest: false,
          pagination: {
            orderBy: OrderBy.DESC,
            orderField: 'block_height',
          },
        };
        this.startMatch = 0;
        const escrowTx = await zoobc.Escrows.getList(paramEscrow);
        const escrowList = escrowTx.escrowsList;
        const escrowGroup = this.groupEscrowList(escrowList);
        const tx = toTransactionListWallet(trxList, this.currAcc.address);

        let rTx = tx.transactions;
        rTx.map(recent => {
          let escStatus = this.matchEscrowGroup(recent.height, escrowGroup);
          recent['alias'] = this.contactServ.get(recent.address).name || '';
          if (escStatus) {
            recent['escrow'] = true;
            recent['escrowStatus'] = escStatus.status;
          } else recent['escrow'] = false;
          recent['multisigchild'] = multisigTx.includes(recent.id);
          return recent;
        });
        this.recentTx = rTx;
        this.totalTx = tx.total;

        const paramPool: MempoolListParams = {
          address: this.currAcc.address,
        };
        const unconfirmTx = await zoobc.Mempool.getList(paramPool);
        this.unconfirmTx = toUnconfirmedSendMoneyWallet(unconfirmTx, this.currAcc.address);
      } catch (error) {
        console.log(error);
        this.isErrorRecentTx = true;
      } finally {
        this.isLoadingRecentTx = false;
        this.lastRefresh = Date.now();
      }
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
  groupEscrowList(escrowList: any[]) {
    const escrowCopy = escrowList.map(x => Object.assign({}, x));
    let escrowGroup = [];
    for (let i = 0; i < escrowCopy.length; i++) {
      let idx = escrowGroup.findIndex(eg => eg.id == escrowCopy[i].id);
      if (idx < 0) escrowGroup.push(escrowCopy[i]);
      else {
        if (escrowGroup[idx].blockheight > escrowCopy[i].blockheight)
          escrowGroup[idx]['blockheight'] = escrowCopy[i].blockheight;
      }
    }
    escrowGroup.sort(function(a, b) {
      return b.blockheight - a.blockheight;
    });
    return escrowGroup;
  }
  matchEscrowGroup(blockheight, escrowList: any[]) {
    let escrowObj: any;
    for (let i = this.startMatch; i < escrowList.length; i++) {
      if (escrowList[i].blockheight == blockheight) {
        escrowObj = Object.assign({}, escrowList[i]);
        this.startMatch = i;
      }
    }
    return escrowObj;
  }
}
