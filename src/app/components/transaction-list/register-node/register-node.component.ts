import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { ZBCTransaction } from 'zoobc-sdk';

@Component({
  selector: 'register-node',
  templateUrl: './register-node.component.html',
})
export class RegisterNodeComponent {
  @Input() transaction: ZBCTransaction[];
  @ViewChild('dialog') detailDialog: TemplateRef<any>;

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
}
