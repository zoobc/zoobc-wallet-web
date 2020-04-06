import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EscrowTransactionDetailComponent } from 'src/app/components/escrow-transaction-detail/escrow-transaction-detail.component';

@Component({
  selector: 'escrow-transactions',
  templateUrl: './escrow-table.component.html',
  styleUrls: ['./escrow-table.component.scss'],
})
export class EscrowTableComponent implements OnInit {
  @Input() escrowTransactionsData;
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Input() withDetail: boolean = false;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  async ngOnInit() {}

  onRefresh() {
    this.refresh.emit(true);
  }

  openDetail(id) {
    if (this.withDetail) {
      this.dialog.open(EscrowTransactionDetailComponent, {
        width: '500px',
        data: id,
      });
    }
  }
}
