import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import zoobc, { TransactionResponse, getZBCAddress } from 'zoobc-sdk';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent implements OnInit {
  transaction: TransactionResponse;
  isLoading: boolean = true;
  constructor(@Inject(MAT_DIALOG_DATA) public id: any) {}

  ngOnInit() {
    zoobc.Transactions.get(this.id).then((transaction: TransactionResponse) => {
      const pubkey = Buffer.from(transaction.transactionhash.toString(), 'base64');
      transaction.transactionhash = getZBCAddress(pubkey, 'ZTX');
      this.transaction = transaction;
      this.isLoading = false;
    });
  }
  redirect() {
    window.open('https://zoobc.net/transactions/' + this.id, '_blank');
  }
}
