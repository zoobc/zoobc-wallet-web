import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service'

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.css']
})
export class ReceiveComponent implements OnInit {

  // value for QR Code
  address: string = ''

  constructor(private appServ: AppService) {
    this.address = appServ.currAddress
  }

  ngOnInit() {
  }

}
