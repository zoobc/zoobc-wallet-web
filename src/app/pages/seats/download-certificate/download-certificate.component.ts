import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { saveAs } from 'file-saver';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import * as sha256 from 'sha256';
const GibberishAES = require('../../../../helpers/gibberish-aes.js');

@Component({
  selector: 'app-download-certificate',
  templateUrl: './download-certificate.component.html',
})
export class DownloadCertificateComponent {
  form: FormGroup;
  passwordField = new FormControl('', Validators.required);
  confirmPassField = new FormControl('', Validators.required);

  constructor(
    public dialogref: MatDialogRef<DownloadCertificateComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.form = new FormGroup({
      password: this.passwordField,
      confirmPass: this.confirmPassField,
    });
  }

  changeConfirmPass() {
    if (this.passwordField.value != this.confirmPassField.value) {
      this.form.get('confirmPass').setErrors({ notmatch: true });
    }
  }

  onSetPassword() {
    if (this.form.valid) {
      Swal.fire({
        text:
          'Are you sure you will remember your password? You will lose your certificate if not. Continue?',
        showCancelButton: true,
        preConfirm: () => {
          const key = this.passwordField.value;
          const cert = {
            nodeKey: this.data.nodeKey,
            ownerAccount: this.data.ownerAccount,
          };
          console.log(cert);
          const plaintText = JSON.stringify(cert);

          let enc: string = GibberishAES.enc(plaintText, key);
          enc = enc.replace(/(\r\n|\n|\r)/gm, '');

          const blob = new Blob([enc]);
          saveAs(blob, 'wallet.zbc');

          this.dialogref.close();
        },
      });
    }
  }
}
