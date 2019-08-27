import { Component, OnInit } from '@angular/core';

import {
  TransactionService,
  Transaction,
} from '../../services/transaction.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-transferhistory',
  templateUrl: './transferhistory.component.html',
  styleUrls: ['./transferhistory.component.scss'],
})
export class TransferhistoryComponent implements OnInit {
  accountHistory: Transaction[] = [];
  unconfirmTx: Transaction[] = [];

  address: string;
  showSpinner: boolean = true;

  constructor(
    private transactionServ: TransactionService,
    private authServ: AuthService
  ) {
    this.address = this.authServ.currAddress;
  }

  ngOnInit() {
    this.transactionServ.getAccountTransaction(1, 10).then((res: any) => {
      this.accountHistory = res;
      this.showSpinner = false;
    });

    this.transactionServ
      .getUnconfirmTransaction()
      .then((res: Transaction[]) => {
        this.unconfirmTx = res;
      });
  }
}
