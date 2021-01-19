import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TransactionType, ZBCTransaction } from 'zbc-sdk';

@Component({
  selector: 'transaction-list',
  templateUrl: './transaction-list.component.html',
})
export class TransactionListComponent {
  @Input() transactionData: ZBCTransaction[];
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  onRefresh() {
    this.refresh.emit(true);
  }
}
