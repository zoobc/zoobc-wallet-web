import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ZooTransactionsInterface, TransactionType } from 'zoobc-sdk';
import { MatDialog } from '@angular/material';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';

@Component({
  selector: 'transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent implements OnInit {
  @Input() transactionData: ZooTransactionsInterface[];
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Input() withDetail: boolean = false;
  @Input() txType: number = TransactionType.SENDMONEYTRANSACTION;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    console.log(this.txType);
  }

  onRefresh() {
    this.refresh.emit(true);
  }

  openDetail(id) {
    if (this.withDetail) {
      this.dialog.open(TransactionDetailComponent, {
        width: '500px',
        maxHeight: '90vh',
        data: id,
      });
    }
  }

  getColorByEscrowStatus(status) {
    let color = 'red';
    if (status == '0') return (color = 'orange');
    if (status == '1') return (color = 'green');
    return color;
  }

  getTextByEscrowStatus(status) {
    let text = '';
    switch (status) {
      case 0:
        text = 'pending';
        break;
      case 1:
        text = 'approved';
        break;
      case 2:
        text = 'rejected';
        break;
      default:
        text = 'expired';
    }
    return text;
  }
}
