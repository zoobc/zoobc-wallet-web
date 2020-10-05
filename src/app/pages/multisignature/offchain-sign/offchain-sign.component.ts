import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MultiSigDraft } from 'src/app/services/multisig.service';
import { generateTransactionHash, signTransactionHash } from 'zoobc-sdk';
import { AuthService } from 'src/app/services/auth.service';
import { onCopyText, getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-offchain-sign',
  templateUrl: './offchain-sign.component.html',
  styleUrls: ['./offchain-sign.component.scss'],
})
export class OffchainSignComponent implements OnInit {
  yourTxHash: string;
  isValid: boolean = false;
  signature: string;

  draft: MultiSigDraft;

  constructor(
    private dialogRef: MatDialogRef<OffchainSignComponent>,
    @Inject(MAT_DIALOG_DATA) private data: MultiSigDraft,
    private authServ: AuthService,
    private snackbar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.draft = data;
  }

  ngOnInit() {}

  onVerify() {
    const { txHash } = this.draft.signaturesInfo;
    this.yourTxHash = generateTransactionHash(Buffer.from(this.draft.unisgnedTransactions));
    this.isValid = this.yourTxHash == txHash ? true : false;
  }

  onSign() {
    const seed = this.authServ.seed;
    this.signature = signTransactionHash(this.yourTxHash, seed).toString('base64');
  }

  async onCopy() {
    const account = this.authServ.getCurrAccount();
    const data = {
      // address: account.signByAddress,
      txHash: this.yourTxHash,
      signature: this.signature,
    };
    const string = `ZBC${Buffer.from(JSON.stringify(data)).toString('base64')}ZBC`;
    onCopyText(string);

    let message = await getTranslation('Signature copied to clipboard', this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
  }
}
