import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TransactionType } from 'zoobc-sdk';
import { ZBCTransaction } from 'zoobc-sdk/types/helper/wallet/Transaction';

@Component({
  selector: 'transaction-list',
  templateUrl: './transaction-list.component.html',
})
export class TransactionListComponent {
  @Input() transactionData: ZBCTransaction[];
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Input() txType: number = TransactionType.SENDMONEYTRANSACTION;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  onRefresh() {
    this.refresh.emit(true);
  }
}
