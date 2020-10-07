import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-send',
  templateUrl: './confirm-send.component.html',
  styleUrls: ['./confirm-send.component.scss'],
})
export class ConfirmSendComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmSendComponent>
  ) {}
  account: any;
  form: any;
  advancedMenu: boolean = false;
  currencyRateName: string;
  ngOnInit() {
    this.account = this.data.account;
    this.form = this.data.form;
    this.advancedMenu = this.data.advancedMenu;
    this.currencyRateName = this.data.currencyName;
  }
  closeDialog() {
    this.dialog.closeAll();
  }
  onConfirm() {
    this.dialogRef.close(true);
  }
}
