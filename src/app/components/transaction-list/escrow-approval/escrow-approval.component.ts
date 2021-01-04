import { Component, Input, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ZBCTransaction } from 'zbc-sdk';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'escrow-approval',
  templateUrl: './escrow-approval.component.html',
})
export class EscrowApprovalComponent {
  @ViewChild('dialog') detailDialog: TemplateRef<any>;
  @Input() transaction: ZBCTransaction;

  color: string = '';
  status: string = '';
  expUrl = environment.expUrl;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    const approval = this.transaction.txBody.approval;
    this.color = approval == '0' ? 'green' : approval == '1' ? 'red' : approval == '2' ? 'red' : '';
    this.status =
      approval == '0' ? 'approved' : approval == '1' ? 'rejected' : approval == '2' ? 'expired' : '';
  }

  openDetail(id) {
    this.dialog.open(this.detailDialog, {
      width: '500px',
      maxHeight: '90vh',
      data: id,
    });
  }
}
