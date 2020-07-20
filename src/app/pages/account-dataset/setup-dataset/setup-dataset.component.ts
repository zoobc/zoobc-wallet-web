import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SavedAccount } from 'src/app/services/auth.service';

@Component({
  selector: 'app-setup-dataset',
  templateUrl: './setup-dataset.component.html',
  styleUrls: ['./setup-dataset.component.scss'],
})
export class SetupDatasetComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) private account: SavedAccount) {}

  ngOnInit() {}
}
