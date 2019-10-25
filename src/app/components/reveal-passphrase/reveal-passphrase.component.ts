import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { generateEncKey, onCopyText } from 'src/helpers/utils';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reveal-passphrase',
  templateUrl: './reveal-passphrase.component.html',
  styleUrls: ['./reveal-passphrase.component.scss'],
})
export class RevealPassphraseComponent implements OnInit {
  formConfirmPin: FormGroup;
  pinField = new FormControl('', Validators.required);
  isConfirmPinLoading = false;
  private phrase: string;

  constructor(
    private authServ: AuthService,
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
        const key = generateEncKey(this.pinField.value);
        const encSeed = localStorage.getItem('ENC_PASSPHRASE_SEED');
        const isPinValid = this.authServ.isPinValid(encSeed, key);
        if (isPinValid) {
          this.phrase = CryptoJS.AES.decrypt(encSeed, key).toString(
            CryptoJS.enc.Utf8
          );
        } else this.formConfirmPin.setErrors({ invalid: true });
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
