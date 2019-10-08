import { Component, OnInit } from '@angular/core';

import {
  TransactionService,
  Transaction,
  Transactions,
} from '../../services/transaction.service';
import { AuthService } from 'src/app/services/auth.service';

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

  address: string;
  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    private transactionServ: TransactionService,
    private authServ: AuthService
  ) {
    this.address = this.authServ.currAddress;
  }

  ngOnInit() {
    this.getTx(true);
    // 72 is transaction item's height
    this.perPage = Math.ceil(window.outerHeight / 72);
  }

  getTx(reload: boolean = false) {
    if (!this.isLoading) {
      if (reload) this.accountHistory = null;

      this.isLoading = true;
      this.isError = false;

      this.transactionServ
        .getAccountTransaction(this.page, this.perPage, this.address)
        .then((res: Transactions) => {
          if (!reload)
            this.accountHistory = this.accountHistory.concat(res.transactions);
          else this.accountHistory = res.transactions;
          this.total = res.total;
          this.isLoading = false;
        })
        .then(() => {
          // if relaad button pressed app will req unconfirmed tx too
          if (reload) {
            this.transactionServ
              .getUnconfirmTransaction(this.address)
              .then((res: Transaction[]) => {
                this.unconfirmTx = res;
              });
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.isError = true;
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
