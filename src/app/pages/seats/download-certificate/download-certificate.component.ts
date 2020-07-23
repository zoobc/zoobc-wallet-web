import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { saveAs } from 'file-saver';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

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
          const string = JSON.stringify(this.data);
          const encrypted = CryptoJS.AES.encrypt(string, this.passwordField.value).toString();
          const blob = new Blob([encrypted]);
          saveAs(blob, 'Certificate.zbc');

          this.dialogref.close();
        },
      });
    }
  }
}
