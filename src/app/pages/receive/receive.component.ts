import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.css'],
})
export class ReceiveComponent implements OnInit {
  // value for QR Code
  address: string = '';
  urlReqCoin: string;

  formRequest: FormGroup;
  amountField = new FormControl('', Validators.required);

  constructor(private accServ: AccountService) {
    this.address = accServ.currAddress;
    this.urlReqCoin = `${window.location.origin}/request/${this.address}/10`;

    this.formRequest = new FormGroup({
      amount: this.amountField,
    });
  }

  copyAddress() {
    this.copyText(this.address);
  }
  copyText(text) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  ngOnInit() {}

  onChangeAmount() {
    if (this.formRequest.valid) {
      const amount = this.amountField.value;
      this.urlReqCoin = `${window.location.origin}/request/${this.address}/${amount}`;
    }
  }
}
