import { Component, OnInit } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import zoobc, { getZBCAdress, TransactionListParams, toTransactionListWallet } from 'zoobc-sdk';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  currAcc: SavedAccount;
  accounts: SavedAccount[];

  constructor(private authServ: AuthService) {
    this.currAcc = this.authServ.getCurrAccount();
  }

  ngOnInit() {}
}
