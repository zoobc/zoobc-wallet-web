import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.css']
})
export class ReceiveComponent implements OnInit {

  // value for QR Code
  address = 'BCZEGOb3WNx3fDOVf9ZS4EjvOIv';

  constructor() { }

  ngOnInit() {
  }

}
