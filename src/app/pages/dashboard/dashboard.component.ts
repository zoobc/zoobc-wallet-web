import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { AddAccountComponent } from '../account/add-account/add-account.component';
import { Router } from '@angular/router';
import { EditAccountComponent } from '../account/edit-account/edit-account.component';

import zoobc, { TransactionListParams, MempoolListParams, ZBCTransaction, AccountBalance } from 'zbc-sdk';
import { Subscription } from 'rxjs';
import { ContactService } from 'src/app/services/contact.service';
import { ReceiveComponent } from '../receive/receive.component';
import { getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { RestoreAccountService } from 'src/app/services/restore-account.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  subscription: Subscription = new Subscription();

  accountBalance: AccountBalance;
  isLoading: boolean = false;
  isError: boolean = false;

  totalTx: number;
  recentTx: ZBCTransaction[];
  unconfirmTx: ZBCTransaction[];

  currAcc: SavedAccount;
  accounts: SavedAccount[];
  lastRefresh: number;
  lastRefreshAccount: number;
  startMatch: number = 0;

  showAccountsList: boolean = true;

  constructor(
    private authServ: AuthService,
    private restoreServ: RestoreAccountService,
    private dialog: MatDialog,
    private router: Router,
    private contactServ: ContactService,
    private translate: TranslateService
  ) {
    this.currAcc = this.authServ.getCurrAccount();

    this.getBalance();

    // const subsRate = this.currencyServ.rate.subscribe(rate => (this.currencyRate = rate));
    // this.subscription.add(subsRate);
    // this.currencyServ
    //   .getRates()
    //   .then(rates => (this.currencyRates = rates))
    //   .catch(err => console.log(err));

    this.showAccountsList =
      this.currAcc.type == 'one time login' || this.currAcc.type == 'address' ? false : true;
  }

  ngOnInit() {
    this.restoreServ.restoreAccounts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getBalance() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.isError = false;

      zoobc.Account.getBalance(this.currAcc.address)
        .then((data: AccountBalance) => {
          this.accountBalance = data;
          return this.authServ.getAccountsWithBalance();
        })
        .then((res: SavedAccount[]) => (this.accounts = res))
        .catch(e => (this.isError = true))
        .finally(() => {
          this.isLoading = false;
          this.lastRefreshAccount = Date.now();
          this.getTransactions();
        });
    }
  }

  async getTransactions() {
    if (!this.isLoading) {
      this.recentTx = null;
      this.unconfirmTx = null;

      this.isLoading = true;
      this.isError = false;

      const params: TransactionListParams = {
        address: this.currAcc.address,
        pagination: {
          page: 1,
          limit: 10,
        },
      };

      try {
        const trxList = await zoobc.Transactions.getList(params);
        trxList.transactions.map(transaction => {
          transaction.senderAlias = this.contactServ.get(transaction.sender.value).name || '';
          transaction.recipientAlias = this.contactServ.get(transaction.recipient.value).name || '';
          return transaction;
        });
        this.recentTx = trxList.transactions;
        this.totalTx = trxList.total;

        const paramPool: MempoolListParams = { address: this.currAcc.address };
        const unconfirmTx = await zoobc.Mempool.getList(paramPool);
        unconfirmTx.transactions.map(transaction => {
          transaction.senderAlias = this.contactServ.get(transaction.sender.value).name || '';
          transaction.recipientAlias = this.contactServ.get(transaction.recipient.value).name || '';
          return transaction;
        });
        this.unconfirmTx = unconfirmTx.transactions;
      } catch (error) {
        console.log(error);
        this.isError = true;
      } finally {
        this.isLoading = false;
        this.lastRefresh = Date.now();
      }
    }
  }

  openReceiveForm() {
    this.dialog.open(ReceiveComponent, { width: '480px' });
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

  async onComingSoonPage() {
    let message = getTranslation('coming soon', this.translate);
    Swal.fire({
      type: 'info',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
