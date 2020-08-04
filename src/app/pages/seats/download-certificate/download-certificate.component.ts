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
          // const jsondata = `{"nodeKey":"evolve list approve kangaroo fringe romance space kit idle shop major open","ownerAccount":"ZBC_RERG3XD7_GAKOZZKY_VMZP2SQE_LBP45DC6_VDFGDTFK_3BZFBQGK_JMWELLO7"}`;
          // const string = JSON.stringify(jsondata);
          // console.log('data: ', string);

          // const key = CryptoJS.MD5(this.passwordField.value).toString();
          // const key = CryptoJS.PBKDF2(this.passwordField.value, 'salt', {
          //   keySize: 8,
          //   iterations: 10000,
          // }).toString();
          // console.log('hash key: ', key);

          // const encrypted = CryptoJS.AES.encrypt(string, key);
          // console.log('encrypted', encrypted.toString());
          // console.log('encrypted key: ', encrypted.key.toString());
          // console.log('encrypted iv: ', encrypted.iv.toString());
          // console.log('encrypted salt: ', encrypted.salt.toString());
          // console.log('encrypted chiper: ', encrypted.ciphertext.toString());

          // const data = {
          //   encrypted: encrypted.toString(),
          //   iv: encrypted.iv.toString(),
          // };
          // {"encrypted":"U2FsdGVkX18ycE8+0gEr3qXPSNJd42+AtviYCnDda5pAioKZRgweJqgqD1GC5+5W+iz9+72woESwI0EnChAl2Zd8h27EWkiu7+ocXIuFfXefsOgpX0KGyRuypVjtEjKNUP8pgKDCE0pT5/JXPRBVK3tJTENIIr97SxYGTmbLD4gQ8NsBMU+P769a/agBXtPj7kEzkuyp8SMxjNUQFVU3iHUG6o2KjBveDpA8zaBIh1I9YEVqifrnJWix91Tf80MjtyUq5qbdMmS+I/tRy/sBmg==","iv":"6ccc2efcaf5b05a01adf38c5dbf4d808"}

          // const blob = new Blob([JSON.stringify(data)]);
          // saveAs(blob, 'Certificate.json');

          // const hashPass = CryptoJS.MD5('12345678').toString();
          // const decrypted = CryptoJS.AES.decrypt(data.encrypted, hashPass).toString(CryptoJS.enc.Utf8);

          const key = this.passwordField.value;
          const cert = {
            nodeKey: this.data.nodeKey,
            ownerAccount: this.data.ownerAccount,
          };
          console.log(cert);

          const plaintText = JSON.stringify(cert);

          let enc: string = GibberishAES.enc(plaintText, key);
          enc = enc.replace(/(\r\n|\n|\r)/gm, '');
          console.log(enc);

          // const data = {
          //   encrypted: enc,
          // };
          // {"encrypted":"U2FsdGVkX18ycE8+0gEr3qXPSNJd42+AtviYCnDda5pAioKZRgweJqgqD1GC5+5W+iz9+72woESwI0EnChAl2Zd8h27EWkiu7+ocXIuFfXefsOgpX0KGyRuypVjtEjKNUP8pgKDCE0pT5/JXPRBVK3tJTENIIr97SxYGTmbLD4gQ8NsBMU+P769a/agBXtPj7kEzkuyp8SMxjNUQFVU3iHUG6o2KjBveDpA8zaBIh1I9YEVqifrnJWix91Tf80MjtyUq5qbdMmS+I/tRy/sBmg==","iv":"6ccc2efcaf5b05a01adf38c5dbf4d808"}

          const blob = new Blob([enc]);
          saveAs(blob, 'wallet.zbc');

          // console.log(JSON.parse(decrypted));
          // {"nodeKey":"evolve list approve kangaroo fringe romance space kit idle shop major open","ownerAccount":"ZBC_RERG3XD7_GAKOZZKY_VMZP2SQE_LBP45DC6_VDFGDTFK_3BZFBQGK_JMWELLO7"}

          this.dialogref.close();
        },
      });
    }
  }
}
