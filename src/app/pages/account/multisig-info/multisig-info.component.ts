import { Component, OnInit, Inject } from '@angular/core';
import { SavedAccount } from 'src/app/services/auth.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-multisig-info',
  templateUrl: './multisig-info.component.html',
  styleUrls: ['./multisig-info.component.scss'],
})
export class MultisigInfoComponent implements OnInit {
  currAcc: SavedAccount;

  constructor(
    public dialogRef: MatDialogRef<MultisigInfoComponent>,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public account: SavedAccount
  ) {
    this.currAcc = this.account;
  }

  ngOnInit() {}

  async onExport() {
    let accountJson = JSON.stringify(this.currAcc);
    const blob = new Blob([accountJson], { type: 'application/JSON' });
    saveAs(blob, `Multisignature-info-${this.currAcc.name}`);
    let message = await getTranslation('Multisig Info successfully exported', this.translate);
    this.snackBar.open(message, null, { duration: 3000 });
  }
}
