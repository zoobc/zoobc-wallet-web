import { Component, OnInit } from '@angular/core';

import {
  TransactionService,
  Transaction,
  Transactions,
} from '../../services/transaction.service';
import { AuthService } from 'src/app/services/auth.service';

import zoobc, {
  HostInterface,
  TransactionListParams,
  toTransactionListWallet,
} from 'zoobc-sdk';

@Component({
  selector: 'app-transferhistory',
  templateUrl: './transferhistory.component.html',
  styleUrls: ['./transferhistory.component.scss'],
})
export class TransferhistoryComponent implements OnInit {
  accountHistory: Transaction[];
  unconfirmTx: Transaction[];

  page: number = 1;
  perPage: number = 10;
  total: number = 0;
  finished: boolean = false;

  address: string = this.authServ.getCurrAccount().address;
  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    private transactionServ: TransactionService,
    private authServ: AuthService
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

      // this.transactionServ
      //   .getTransactions(this.page, perPage, this.address)
      //   .then((res: Transactions) => {
      //     this.total = res.total;

      //     if (reload) {
      //       this.accountHistory = res.transactions;
      //       return this.transactionServ.getUnconfirmTransaction(this.address);
      //     } else
      //       this.accountHistory = this.accountHistory.concat(res.transactions);
      //   })
      //   .then((unconfirmTx: Transaction[]) => {
      //     // if relaad button pressed app will req unconfirmed tx too
      //     if (unconfirmTx) this.unconfirmTx = unconfirmTx;
      //   })
      //   .catch(() => {
      //     this.isError = true;
      //     this.unconfirmTx = null;
      //   })
      //   .finally(() => (this.isLoading = false));
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
          this.total = tx.total;
          if (reload) {
            this.accountHistory = <Transaction[]>tx.transactions;
            return this.transactionServ.getUnconfirmTransaction(this.address);
          } else {
            this.accountHistory = this.accountHistory.concat(<Transaction[]>(
              tx.transactions
            ));
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
