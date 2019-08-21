import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/services/auth.service';
import { toBase64Url } from 'src/helpers/converters';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss'],
})
export class ReceiveComponent implements OnInit {
  // value for QR Code
  address: string = '';
  qrCode: string;
  url: string;

  formRequest: FormGroup;
  amountField = new FormControl('', Validators.required);

  constructor(private authServ: AuthService, private snackBar: MatSnackBar) {
    this.address = this.authServ.currAddress;

    this.formRequest = new FormGroup({
      amount: this.amountField,
    });
  }

  copyAddress() {
    this.onCopyText(this.address);
  }
  onCopyText(text) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackBar.open('Copied to clipboard', null, { duration: 3000 });
  }

  ngOnInit() {}

  onChangeAmount() {
    if (this.formRequest.valid) {
      const request = `${this.address}/${this.amountField.value}`;
      this.qrCode = CryptoJS.AES.encrypt(request, 'ZBC').toString();
      this.qrCode = toBase64Url(this.qrCode);
      this.url = `${window.location.origin}/request/${this.qrCode}`;
    }
  }
}
