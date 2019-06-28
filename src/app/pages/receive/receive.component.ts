import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.css'],
})
export class ReceiveComponent implements OnInit {
  // value for QR Code
  address: string = '';

  constructor(private appServ: AppService) {
    this.address = appServ.currAddress;
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
}
