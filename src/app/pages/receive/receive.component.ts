import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss'],
})
export class ReceiveComponent implements OnInit {
  // value for QR Code
  address: string = '';
  urlReqCoin: string;

  formRequest: FormGroup;
  amountField = new FormControl('', Validators.required);

  constructor(private authServ: AuthService, private snackBar: MatSnackBar) {
    this.address = this.authServ.currAddress;
    this.urlReqCoin = `${window.location.origin}/request/${this.address}/10`;

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
      const amount = this.amountField.value;
      this.urlReqCoin = `${window.location.origin}/request/${this.address}/${amount}`;
    }
  }
}
