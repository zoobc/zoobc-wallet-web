import { Component, OnInit, Inject } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Transaction } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent implements OnInit {
  transaction: Transaction;
  isLoading: boolean = true;
  constructor(
    private transactionServ: TransactionService,
    @Inject(MAT_DIALOG_DATA) public id: any
  ) {}

  ngOnInit() {
    this.transactionServ
      .getTransaction(this.id)
      .then((transaction: Transaction) => {
        this.transaction = transaction;
        this.isLoading = false;
      });
  }
}
