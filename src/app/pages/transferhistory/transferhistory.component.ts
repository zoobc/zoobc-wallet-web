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

  txType: number = TransactionType.SENDMONEYTRANSACTION;

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
        this.activeRoute.queryParams.subscribe(res => {
          this.txType = parseInt(res.type) || TransactionType.SENDMONEYTRANSACTION;
        });
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
    if (this.accountHistory && this.accountHistory.length < this.total) {
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
