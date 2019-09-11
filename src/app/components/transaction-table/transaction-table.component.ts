import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from 'src/app/grpc/model/transaction_pb';
import { MatDialog } from '@angular/material';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
})
export class TransactionTableComponent implements OnInit {
  @Input() transactionData: Transaction[];
  @Input() isLoading: boolean = false;
  @Input() withDetail: boolean = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

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
