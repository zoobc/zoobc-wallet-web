import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss'],
})
export class ReceiveComponent implements OnInit {
  address: string = '';

  constructor(private authServ: AuthService) {
    this.address = this.authServ.currAddress;
  }

  ngOnInit() {}
}
