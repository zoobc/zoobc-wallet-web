import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import { ZooTransactionsInterface } from 'zoobc-sdk';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
})
export class TransactionTableComponent implements OnInit {
  @Input() transactionData: ZooTransactionsInterface[];
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Input() withDetail: boolean = false;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  onRefresh() {
    this.refresh.emit(true);
  }

  openDetail(id) {
    if (this.withDetail) {
      this.dialog.open(TransactionDetailComponent, {
        width: '500px',
        height: '500px',
        data: id,
      });
    }
  }
}
