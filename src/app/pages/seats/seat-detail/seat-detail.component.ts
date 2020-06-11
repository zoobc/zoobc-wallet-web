import { Component, OnInit } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-seat-detail',
  templateUrl: './seat-detail.component.html',
  styleUrls: ['./seat-detail.component.scss'],
})
export class SeatDetailComponent implements OnInit {
  account: SavedAccount;
  nodePublicKey: string = 'AFiTqqX99kYXjLFJJ2AWuzKK5zxYUT1Pn0p3s6lutkai';

  constructor(private authServ: AuthService, private translate: TranslateService, public dialog: MatDialog) {}

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
  }

  onSwitch(account: SavedAccount) {
    this.account = account;
  }

  generateRandomNodePublicKey(length: number = 44) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return (this.nodePublicKey = result);
  }
}
