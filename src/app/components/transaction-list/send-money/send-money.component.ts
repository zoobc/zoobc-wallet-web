import { Component, ViewChild, TemplateRef, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { ZBCTransaction } from 'zoobc-sdk';

@Component({
  selector: 'send-money',
  templateUrl: './send-money.component.html',
})
export class SendMoneyComponent {
  @ViewChild('dialog') detailDialog: TemplateRef<any>;
  @Input() transaction: ZBCTransaction;

  address: string;

  constructor(private dialog: MatDialog, authServ: AuthService) {
    this.address = authServ.getCurrAccount().address;
  }

  openDetail(id) {
    this.dialog.open(this.detailDialog, {
      width: '500px',
      maxHeight: '90vh',
      data: id,
    });
  }

  getEscrowColor(status) {
    return status == '0' ? 'yellow' : status == '1' ? 'green' : status == '2' ? 'red' : 'red';
  }

  getEscrowStatus(status) {
    return status == '0' ? 'pending' : status == '1' ? 'approved' : status == '2' ? 'rejected' : 'expired';
  }
}
