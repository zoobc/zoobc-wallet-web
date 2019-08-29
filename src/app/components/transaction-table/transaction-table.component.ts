import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from 'src/app/grpc/model/transaction_pb';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
})
export class TransactionTableComponent implements OnInit {
  @Input() transactionData: Transaction[];
  @Input() isLoading: boolean = false;
  constructor() {}

  ngOnInit() {}
}
