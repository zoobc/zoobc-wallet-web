// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

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

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import zoobc, {
  TransactionListParams,
  MempoolListParams,
  TransactionType,
  ZBCTransaction,
  Address,
  ZBCTransactions,
} from 'zbc-sdk';

import { ContactService } from 'src/app/services/contact.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transferhistory',
  templateUrl: './transferhistory.component.html',
})
export class TransferhistoryComponent implements OnDestroy {
  accountHistory: ZBCTransaction[];
  unconfirmTx: ZBCTransaction[];

  txType: number = undefined;

  page: number = 1;
  perPage: number = 10;
  total: number = 0;
  finished: boolean = false;

  address: Address = this.authServ.getCurrAccount().address;
  isLoading: boolean = false;
  isError: boolean = false;
  lastRefresh: number;
  startMatch: number = 0;

  routerEvent: Subscription;

  constructor(
    private authServ: AuthService,
    private contactServ: ContactService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.routerEvent = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute.queryParams.subscribe(res => (this.txType = parseInt(res.type) || undefined));
        this.getTx(true);
      }
    });
  }

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }

  async getTx(reload: boolean = false) {
    if (!this.isLoading) {
      // 72 is transaction item's height
      const perPage = Math.ceil(window.outerHeight / 72);

      if (reload) {
        this.accountHistory = null;
        this.page = 1;
      }

      this.isLoading = true;
      this.isError = false;

      const txParam: TransactionListParams = {
        address: this.address,
        transactionType: this.txType,
        pagination: {
          page: this.page,
          limit: perPage,
        },
      };

      try {
        const trxList = await zoobc.Transactions.getList(txParam);
        trxList.transactions.map(transaction => {
          transaction.senderAlias = this.contactServ.get(transaction.sender.value).name || '';
          transaction.recipientAlias = this.contactServ.get(transaction.recipient.value).name || '';
          return transaction;
        });
        this.total = trxList.total;
        this.accountHistory = reload
          ? trxList.transactions
          : this.accountHistory.concat(trxList.transactions);

        if (reload) {
          const mempoolParams: MempoolListParams = { address: this.address, txType: this.txType };
          const unconfirmTx = await zoobc.Mempool.getList(mempoolParams);

          unconfirmTx.transactions.map(transaction => {
            transaction.senderAlias = this.contactServ.get(transaction.sender.value).name || '';
            transaction.recipientAlias = this.contactServ.get(transaction.recipient.value).name || '';
            return transaction;
          });
          this.unconfirmTx = unconfirmTx.transactions;
        }
      } catch {
        this.isError = true;
        this.unconfirmTx = null;
      } finally {
        this.isLoading = false;
        this.lastRefresh = Date.now();
      }
    }
  }

  onFilter(type: number) {
    this.router.navigate(['/transferhistory'], { queryParams: { type } });
  }

  onScroll() {
    if (this.accountHistory && this.accountHistory.length < this.total && !this.isLoading) {
      this.page++;
      this.getTx();
    } else this.finished = true;
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
