import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import zoobc, {
  TransactionListParams,
  toTransactionListWallet,
  MempoolListParams,
  toUnconfirmedSendMoneyWallet,
  TransactionsResponse,
  MempoolTransactionsResponse,
  TransactionType,
  EscrowListParams,
} from 'zoobc-sdk';

import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-transferhistory',
  templateUrl: './transferhistory.component.html',
})
export class TransferhistoryComponent implements OnInit {
  accountHistory: any[];
  unconfirmTx: any[];

  page: number = 1;
  perPage: number = 10;
  total: number = 0;
  finished: boolean = false;

  address: string = this.authServ.getCurrAccount().address;
  isLoading: boolean = false;
  isError: boolean = false;
  lastRefresh: number;

  constructor(private authServ: AuthService, private contactServ: ContactService) {}

  ngOnInit() {
    this.getTx(true);
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
        transactionType: TransactionType.SENDMONEYTRANSACTION,
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

        const paramEscrowSend: EscrowListParams = {
          sender: this.address,
          // blockHeightStart: firstHeight,
          // blockHeightEnd: lastHeight,
          statusList: [0, 1, 2, 3],
        };
        const paramEscrowReceive: EscrowListParams = {
          recipient: this.address,
          // blockHeightStart: firstHeight,
          // blockHeightEnd: lastHeight,
          statusList: [0, 1, 2, 3],
        };

        const escrowSend = await zoobc.Escrows.getList(paramEscrowSend);
        const escrowReceive = await zoobc.Escrows.getList(paramEscrowReceive);

        const escrowList = escrowSend.escrowsList.concat(escrowReceive.escrowsList);

        let tx = toTransactionListWallet(trxList, this.address);
        tx.transactions.map(recent => {
          recent['alias'] = this.contactServ.get(recent.address).name || '';
          recent['escrow'] = recent['escrow'] = this.checkIdOnEscrow(recent.id, escrowList);
          if (recent['escrow']) recent['escrowStatus'] = this.getEscrowStatus(recent.id, escrowList);
          recent['multisigchild'] = multisigTx.includes(recent.id);
          return recent;
        });
        this.total = tx.total;
        this.accountHistory = reload ? tx.transactions : this.accountHistory.concat(tx.transactions);

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

  onScroll() {
    if (this.accountHistory && this.accountHistory.length < this.total) {
      this.page++;
      this.getTx();
    } else this.finished = true;
  }

  checkIdOnEscrow(id: any, escrowArr: any[]) {
    const filter = escrowArr.filter(arr => arr.id == id);
    if (filter.length > 0) return true;
    return false;
  }
  getEscrowStatus(id: any, escrowArr: any[]) {
    const idx = escrowArr.findIndex(esc => esc.id == id);
    return escrowArr[idx].status;
  }
}
