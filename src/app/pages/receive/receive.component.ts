import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { onCopyText } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss'],
})
export class ReceiveComponent implements OnInit {
  address: string = '';
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
    this.urlReqCoin = `${window.location.origin}/request/${this.address}`;
    this.qrCodeStr = JSON.stringify({ address: this.address, amount: '' });
  }

  ngOnInit() {}

  onChangeAmount(amount) {
    if (amount != '') {
      this.urlReqCoin = `${window.location.origin}/request/${this.address}/${amount}`;
    } else {
      this.urlReqCoin = `${window.location.origin}/request/${this.address}`;
    }

    const qrCode = { address: this.address, amount };
    this.qrCodeStr = JSON.stringify(qrCode);
  }

  async onCopyText(e) {
    e.stopPropagation();
    onCopyText(this.urlReqCoin);

    let message: string;
    await this.translate
      .get('Address copied to clipboard')
      .toPromise()
      .then(res => (message = res));
    this.snackbar.open(message, null, { duration: 3000 });
  }
}
