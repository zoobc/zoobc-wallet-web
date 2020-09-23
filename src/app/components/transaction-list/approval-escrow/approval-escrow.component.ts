import { Component, Input, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ZBCTransaction } from 'zoobc-sdk';

@Component({
  selector: 'approval-escrow',
  templateUrl: './approval-escrow.component.html',
})
export class ApprovalEscrowComponent {
  @ViewChild('dialog') detailDialog: TemplateRef<any>;
  @Input() transaction: ZBCTransaction[];

  constructor(private dialog: MatDialog) {}

  openDetail(id) {
    this.dialog.open(this.detailDialog, {
      width: '500px',
      maxHeight: '90vh',
      data: id,
    });
  }

  getEscrowColor(status) {
    return status == '0' ? 'green' : status == '1' ? 'red' : status == '2' ? 'red' : '';
  }

  getEscrowStatus(status) {
    return status == '0' ? 'approved' : status == '1' ? 'rejected' : status == '2' ? 'expired' : '';
  }
}
