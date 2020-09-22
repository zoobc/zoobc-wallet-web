import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ZooTransactionsInterface, TransactionType } from 'zoobc-sdk';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'transaction-list',
  templateUrl: './transaction-list.component.html',
})
export class TransactionListComponent {
  @Input() transactionData: ZooTransactionsInterface[];
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Input() withDetail: boolean = false;
  @Input() txType: number = TransactionType.SENDMONEYTRANSACTION;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  onRefresh() {
    this.refresh.emit(true);
  }
}
