import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { onCopyText, getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { Address } from 'zoobc-sdk';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss'],
})
export class ReceiveComponent implements OnInit {
  address: Address;
  urlReqCoin: string;
  qrCodeStr: string;

  formRequest: FormGroup;
  amountField = new FormControl('');

  constructor(
    private authServ: AuthService,
    private translate: TranslateService,
    private snackbar: MatSnackBar
  ) {
    this.formRequest = new FormGroup({
      amount: this.amountField,
    });

    this.address = this.authServ.getCurrAccount().address;
    this.urlReqCoin = `${window.location.origin}/request/${this.address.value}`;
    this.qrCodeStr = this.address.value + '||' + this.amountField.value;
  }

  ngOnInit() {}

  onChangeAmount(amount) {
    if (amount != '') {
      this.urlReqCoin = `${window.location.origin}/request/${this.address.value}/${amount}`;
    } else {
      this.urlReqCoin = `${window.location.origin}/request/${this.address.value}`;
    }

    this.qrCodeStr = this.address.value + '||' + this.amountField.value;
  }

  async onCopyText(e) {
    e.stopPropagation();
    onCopyText(this.urlReqCoin);

    let message = getTranslation('address copied to clipboard', this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
  }
}
