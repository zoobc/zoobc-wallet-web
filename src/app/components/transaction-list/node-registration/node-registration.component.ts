import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ZBCTransaction } from 'zbc-sdk';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'node-registration',
  templateUrl: './node-registration.component.html',
})
export class NodeRegistrationComponent {
  @Input() transaction: ZBCTransaction;
  @ViewChild('dialog') detailDialog: TemplateRef<any>;

  expUrl = environment.expUrl;

  constructor(private dialog: MatDialog) {}

  openDetail(id) {
    this.dialog.open(this.detailDialog, {
      width: '500px',
      maxHeight: '90vh',
      data: id,
    });
  }
}
