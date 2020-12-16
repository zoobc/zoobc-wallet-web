import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ZBCTransaction } from 'zbc-sdk';

@Component({
  selector: 'account-dataset',
  templateUrl: './account-dataset.component.html',
})
export class AccountDatasetComponent implements OnInit {
  @ViewChild('dialog') detailDialog: TemplateRef<any>;
  @Input() transaction: ZBCTransaction;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openDetail(id) {
    this.dialog.open(this.detailDialog, {
      width: '500px',
      maxHeight: '90vh',
      data: id,
    });
  }
}
