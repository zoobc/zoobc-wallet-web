import { Component, OnInit } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { onCopyText } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-multisig-info',
  templateUrl: './multisig-info.component.html',
  styleUrls: ['./multisig-info.component.scss'],
})
export class MultisigInfoComponent implements OnInit {
  currAcc: SavedAccount;
  account: SavedAccount[];

  address: string = 'SDxshdwefdhabfdlkjKBFHdfajwdaasflSsdfj';
  nonce: number = 1;
  minAdress = 3;
  url: string = 'https://zoobc.one/...SxhdnfHF';

  constructor(
    public dialogRef: MatDialogRef<MultisigInfoComponent>,
    private authServ: AuthService,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
    this.currAcc = this.authServ.getCurrAccount();
  }

  ngOnInit() {}

  async copyPhrase() {
    onCopyText(this.url);

    let message: string;
    await this.translate
      .get('Link Copied')
      .toPromise()
      .then(res => (message = res));
    this.snackBar.open(message, null, { duration: 3000 });
  }
}
