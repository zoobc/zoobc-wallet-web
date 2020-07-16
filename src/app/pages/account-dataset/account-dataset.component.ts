import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SavedAccount } from 'src/app/services/auth.service';
@Component({
  selector: 'app-account-dataset',
  templateUrl: './account-dataset.component.html',
  styleUrls: ['./account-dataset.component.scss'],
})
export class AccountDatasetComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<AccountDatasetComponent>,
    @Inject(MAT_DIALOG_DATA) private account: SavedAccount
  ) {}

  ngOnInit() {}
}
