import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import zoobc, { EscrowTransactionResponse } from 'zoobc-sdk';

@Component({
  selector: 'app-approval-escrow-transaction',
  templateUrl: './approval-escrow-transaction.component.html',
  styleUrls: ['./approval-escrow-transaction.component.scss'],
})
export class ApprovalEscrowTransactionComponent implements OnInit {
  @Input() approvalEscrowData: any[];
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  @Input() withDetail: boolean = false;
  @ViewChild('detailEscrow') detailEscrow: TemplateRef<any>;
  escrowDetail: EscrowTransactionResponse;
  isLoadingDetail: boolean;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  onRefresh() {
    this.refresh.emit(true);
  }

  openDetail(id) {
    if (this.withDetail) {
      this.isLoadingDetail = true;
      zoobc.Escrows.get(id).then((res: EscrowTransactionResponse) => {
        this.escrowDetail = res;
        this.isLoadingDetail = false;
      });
      this.dialog.open(this.detailEscrow, {
        width: '500px',
        maxHeight: '90vh',
      });
    }
  }
}
