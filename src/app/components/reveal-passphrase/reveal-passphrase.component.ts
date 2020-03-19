import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { onCopyText } from 'src/helpers/utils';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import zoobc from 'zoobc-sdk';

@Component({
  selector: 'app-reveal-passphrase',
  templateUrl: './reveal-passphrase.component.html',
  styleUrls: ['./reveal-passphrase.component.scss'],
})
export class RevealPassphraseComponent implements OnInit {
  formConfirmPin: FormGroup;
  pinField = new FormControl('', Validators.required);
  isConfirmPinLoading = false;
  phrase: string;
  arrPhrase: string[];

  constructor(
    public dialogRef: MatDialogRef<RevealPassphraseComponent>,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
    this.formConfirmPin = new FormGroup({ pin: this.pinField });
  }

  ngOnInit() {}

  onTypePin() {
    if (this.pinField.value.length == 6) {
      this.isConfirmPinLoading = true;

      setTimeout(() => {
        const encPassphrase = localStorage.getItem('ENC_PASSPHRASE_SEED');

        this.phrase = zoobc.Wallet.decryptPassphrase(
          encPassphrase,
          this.pinField.value
        );
        if (this.phrase) this.arrPhrase = this.phrase.split(' ');
        else this.formConfirmPin.setErrors({ invalid: true });
        this.isConfirmPinLoading = false;
      }, 50);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  async copyPhrase() {
    onCopyText(this.phrase);

    let message: string;
    await this.translate
      .get('Passphrase Copied')
      .toPromise()
      .then(res => (message = res));
    this.snackBar.open(message, null, { duration: 3000 });
  }
}
