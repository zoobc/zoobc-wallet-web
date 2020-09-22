import { Component, Input, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'approval-escrow',
  templateUrl: './approval-escrow.component.html',
})
export class ApprovalEscrowComponent {
  @ViewChild('dialog') detailDialog: TemplateRef<any>;
  @Input() transaction: any;

  constructor(private dialog: MatDialog) {}

  openDetail(id) {
    this.dialog.open(this.detailDialog, {
      width: '500px',
      maxHeight: '90vh',
      data: id,
    });
  }

  getColorByEscrowStatus(status) {
    let color = '';
    if (status == '0') return (color = 'red');
    if (status == '1') return (color = 'green');
    return color;
  }

  getTextByEscrowStatus(status) {
    let text = '';
    switch (status) {
      case 0:
        text = 'rejected';
        break;
      case 1:
        text = 'approved';
        break;
      // case 2:
      //   text = 'rejected';
      //   break;
      // default:
      //   text = 'expired';
    }
    return text;
  }
}
