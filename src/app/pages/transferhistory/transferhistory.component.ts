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
  total: number = 0;
  finished: boolean = false;

  address: string;
  showSpinner: boolean = false;

  constructor(
    private transactionServ: TransactionService,
    private authServ: AuthService
  ) {
    this.address = this.authServ.currAddress;
  }

  ngOnInit() {
    this.getTx();

    this.transactionServ
      .getUnconfirmTransaction()
      .then((res: Transaction[]) => {
        this.unconfirmTx = res;
      });
  }

  getTx() {
    this.showSpinner = true;
    this.transactionServ
      .getAccountTransaction(this.page, 5)
      .then((res: Transactions) => {
        if (this.accountHistory)
          this.accountHistory = this.accountHistory.concat(res.transactions);
        else this.accountHistory = res.transactions;
        this.total = res.total;
        this.showSpinner = false;
      });
  }

  onScroll() {
    if (this.accountHistory && this.accountHistory.length < this.total) {
      this.page++;
      this.getTx();
    } else this.finished = true;
  }
}
