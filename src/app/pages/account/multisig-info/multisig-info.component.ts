import { Component, OnInit, Inject } from '@angular/core';
import { SavedAccount } from 'src/app/services/auth.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { onCopyText, getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';

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

  async onCopyText(e) {
    e.stopPropagation();
    const account = JSON.stringify(this.currAcc);
    const accountBase64 = Buffer.from(account).toString('base64');
    const url = `${window.location.origin}/accounts/${accountBase64}`;

    onCopyText(url);

    let message = await getTranslation('Multisig Info copied to clipboard', this.translate);
    this.snackBar.open(message, null, { duration: 3000 });
  }
}
