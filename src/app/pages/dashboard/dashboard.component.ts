// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

//     2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
// contact us at roberto.capodieci[at]blockchainzoo.com
// and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { AddAccountComponent } from '../account/add-account/add-account.component';
import { EditAccountComponent } from '../account/edit-account/edit-account.component';
import { Subscription, timer } from 'rxjs';
import { ContactService } from 'src/app/services/contact.service';
import { ReceiveComponent } from '../receive/receive.component';
import { getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { RestoreAccountService } from 'src/app/services/restore-account.service';
import { MultisigService } from 'src/app/services/multisig.service';
import zoobc, {
  TransactionListParams,
  MempoolListParams,
  ZBCTransaction,
  AccountBalance,
  TransactionType,
} from 'zbc-sdk';

interface AmountFormatted {
  currency: String;
  amount1: String;
  amount2: String;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  subscription: Subscription = new Subscription();

  spendableBalanceFormatted: AmountFormatted;
  accountBalanceFormatted: AmountFormatted;
  lockedBalanceFormatted: AmountFormatted;

  lockedBalance: number = 0;
  accountBalance: AccountBalance;
  isLoading: boolean = false;
  isError: boolean = false;

  totalTx: number;
  recentTx: ZBCTransaction[];
  unconfirmTx: ZBCTransaction[];

  reloadingTimer: Subscription;
  currAcc: SavedAccount;
  accounts: SavedAccount[];
  lastRefresh: number;
  lastRefreshAccount: number;

  showAccountsList: boolean = true;

  constructor(
    private authServ: AuthService,
    private restoreServ: RestoreAccountService,
    private dialog: MatDialog,
    private router: Router,
    private contactServ: ContactService,
    private translate: TranslateService,
    private multisigServ: MultisigService
  ) {
    this.currAcc = this.authServ.getCurrAccount();

    this.loadBalanceAndTxs();
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
    this.reloadingTimer.unsubscribe();
  }

  loadBalanceAndTxs() {
    if (this.reloadingTimer) this.reloadingTimer.unsubscribe();

    this.isLoading = true;
    this.isError = false;
    this.reloadingTimer = timer(0, 60 * 1000).subscribe(async next => {
      if (next == 0) {
        this.isLoading = true;
        this.recentTx = null;
        this.unconfirmTx = null;
      }

      try {
        await this.getBalance();
        await this.getTransactions();
        this.isError = false;
      } catch {
        if (next == 0) this.isError = true;
      }
      this.isLoading = false;
    });
  }

  amountFormatting(val) {
    const amnt = parseFloat(val) / 1e8;
    const amnts = amnt.toString().split('.');

    return {
      currency: 'ZBC ',
      amount1: amnts[0],
      amount2: amnts[1] ? `.${amnts[1].slice(0, 4)}` : '',
    };
  }

  getBalance() {
    zoobc.Account.getBalance(this.currAcc.address)
      .then((data: AccountBalance) => {
        this.accountBalance = data;

        const lockedBalance = data.balance - data.spendableBalance;
        this.lockedBalance = lockedBalance;
        this.lockedBalanceFormatted = this.amountFormatting(lockedBalance);
        this.accountBalanceFormatted = this.amountFormatting(data.balance);
        this.spendableBalanceFormatted = this.amountFormatting(data.spendableBalance);
        return this.authServ.getAccountsWithBalance();
      })
      .then((res: SavedAccount[]) => (this.accounts = res))
      .catch(e => {
        console.log(e);
        throw e;
      })
      .finally(() => (this.lastRefreshAccount = Date.now()));
  }

  async getTransactions() {
    try {
      const params: TransactionListParams = {
        address: this.currAcc.address,
        pagination: {
          page: 1,
          limit: 10,
        },
      };
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
      throw error;
    } finally {
      this.lastRefresh = Date.now();
    }
  }

  goToMultisig() {
    if (this.currAcc.type == 'multisig')
      this.multisigServ.initDraft(this.currAcc, TransactionType.SENDZBCTRANSACTION);
  }

  openReceiveForm() {
    this.dialog.open(ReceiveComponent, { width: '480px' });
  }

  onSwitchAccount(account: SavedAccount) {
    this.authServ.switchAccount(account);
    this.router.navigateByUrl('/');
  }

  onOpenAddAccount() {
    const dialog = this.dialog.open(AddAccountComponent, { width: '700px', maxHeight: '99vh' });

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
}
