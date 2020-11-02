import { Component, ViewChild, TemplateRef, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { Address, ZBCTransaction } from 'zoobc-sdk';

@Component({
  selector: 'send-money',
  templateUrl: './send-money.component.html',
})
export class SendMoneyComponent implements OnInit {
  @ViewChild('dialog') detailDialog: TemplateRef<any>;
  @Input() transaction: ZBCTransaction;

  address: Address;
  status: string = '';
  color: string = '';

  constructor(private dialog: MatDialog, authServ: AuthService) {
    this.address = authServ.getCurrAccount().address;
  }

  ngOnInit() {
    const approval = this.transaction.txBody.approval;
    this.color = approval == '0' ? 'yellow' : approval == '1' ? 'green' : approval == '2' ? 'red' : 'red';
    this.status =
      approval == '0' ? 'pending' : approval == '1' ? 'approved' : approval == '2' ? 'rejected' : 'expired';
  }

  openDetail(id) {
    this.dialog.open(this.detailDialog, {
      width: '500px',
      maxHeight: '90vh',
      data: id,
    });
  }
}
