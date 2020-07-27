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
        let tx = await zoobc.Transactions.getList(txParam).then((res: TransactionsResponse) =>
          toTransactionListWallet(res, this.address)
        );
        tx.transactions.map(recent => {
          recent['alias'] = this.contactServ.get(recent.address).alias || '';
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
}
