import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { onCopyText } from 'src/helpers/utils';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss'],
})
export class ReceiveComponent implements OnInit {
  address: string = '';

  constructor(private authServ: AuthService, private snackBar: MatSnackBar) {
    this.address = this.authServ.currAddress;
  }

  ngOnInit() {}

  copyAddress() {
    onCopyText(this.address);
    this.snackBar.open('Address copied', null, { duration: 3000 });
  }
}
