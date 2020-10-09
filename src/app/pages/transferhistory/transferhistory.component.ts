import { Component, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import zoobc, {
  TransactionListParams,
  MempoolListParams,
  toUnconfirmedSendMoneyWallet,
  MempoolTransactionsResponse,
  TransactionType,
  EscrowListParams,
  OrderBy,
  toZBCTransactions,
  ZBCTransaction,
  getZBCAddress,
} from 'zoobc-sdk';

import { ContactService } from 'src/app/services/contact.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transferhistory',
  templateUrl: './transferhistory.component.html',
})
export class TransferhistoryComponent implements OnDestroy {
  accountHistory: ZBCTransaction[];
  unconfirmTx: any[];

  txType: number = TransactionType.SENDMONEYTRANSACTION;

  page: number = 1;
  perPage: number = 10;
  total: number = 0;
  finished: boolean = false;

  address: string = this.authServ.getCurrAccount().address;
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
        this.activeRoute.queryParams.subscribe(
          res => (this.txType = parseInt(res.type) || TransactionType.SENDMONEYTRANSACTION)
        );
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
        let trxList = await zoobc.Transactions.getList(txParam);

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
          recipient: this.address,
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

        let txs = toZBCTransactions(trxList.transactionsList);
        console.log(txs);

        txs.map(recent => {
          let escStatus = this.matchEscrowGroup(recent.height, escrowGroup);
          recent.senderAlias = this.contactServ.get(recent.sender).name || '';
          recent.recipientAlias = this.contactServ.get(recent.recipient).name || '';
          if (this.txType == 2 || this.txType == 258 || this.txType == 514 || this.txType == 770) {
            if (recent.txBody.nodepublickey) {
              const buffer = Buffer.from(recent.txBody.nodepublickey.toString(), 'base64');
              const pubkey = getZBCAddress(buffer, 'ZNK');
              recent['txBody'].nodepublickey = pubkey;
            }
          }
          if (escStatus) {
            recent.escrow = true;
            recent.escrowStatus = escStatus.status;
          } else recent.escrow = false;
          recent.multisig = multisigTx.includes(recent.id);
          return recent;
        });
        this.total = parseInt(trxList.total);
        this.accountHistory = reload ? txs : this.accountHistory.concat(txs);

        if (reload) {
          const mempoolParams: MempoolListParams = { address: this.address };
          this.unconfirmTx = await zoobc.Mempool.getList(mempoolParams).then(
            (res: MempoolTransactionsResponse) => toUnconfirmedSendMoneyWallet(res, this.address)
          );
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
