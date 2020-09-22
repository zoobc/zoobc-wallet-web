import { Component, ViewChild, TemplateRef, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'send-money',
  templateUrl: './send-money.component.html',
})
export class SendMoneyComponent {
  @ViewChild('dialog') detailDialog: TemplateRef<any>;
  @Input() transaction: any;

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
