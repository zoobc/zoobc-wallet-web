import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.css']
})
export class ReceiveComponent implements OnInit {

  // value for QR Code
  address = localStorage.getItem('publicKey');;

  constructor() { }

  ngOnInit() {
  }

}
