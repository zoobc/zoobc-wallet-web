import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-confirm-update',
  templateUrl: './confirm-update.component.html',
  styleUrls: ['./confirm-update.component.scss'],
})
export class ConfirmUpdateComponent implements OnInit {
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ConfirmUpdateComponent>) {}

  ngOnInit() {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
