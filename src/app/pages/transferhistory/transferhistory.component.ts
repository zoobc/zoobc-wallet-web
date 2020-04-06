import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import zoobc, {
  TransactionListParams,
  toTransactionListWallet,
  MempoolListParams,
} from 'zoobc-sdk';

import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-transferhistory',
  templateUrl: './transferhistory.component.html',
  styleUrls: ['./transferhistory.component.scss'],
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

  constructor(
    private authServ: AuthService,
    private contactServ: ContactService
  ) {}

  ngOnInit() {
    this.getTx(true);
  }

  getTx(reload: boolean = false) {
    if (!this.isLoading) {
      // 72 is transaction item's height
      const perPage = Math.ceil(window.outerHeight / 72);

      if (reload) {
        this.accountHistory = null;
        this.page = 1;
      }

      this.isLoading = true;
      this.isError = false;

      const params: TransactionListParams = {
        address: this.address,
        transactionType: 1,
        pagination: {
          page: this.page,
          limit: perPage,
        },
      };
      zoobc.Transactions.getList(params)
        .then(res => {
          const tx = toTransactionListWallet(res, this.address);
          tx.transactions.map(recent => {
            recent['alias'] =
              this.contactServ.getContact(recent.address).alias || '';
          });
          this.total = tx.total;
          if (reload) {
            this.accountHistory = tx.transactions;
            const params: MempoolListParams = { address: this.address };
            return zoobc.Mempool.getList(params);
          } else {
            this.accountHistory = this.accountHistory.concat(tx.transactions);
          }
        })
        .catch(e => {
          this.isError = true;
          this.unconfirmTx = null;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  onScroll() {
    if (this.accountHistory && this.accountHistory.length < this.total) {
      this.page++;
      this.getTx();
    } else this.finished = true;
  }
}
