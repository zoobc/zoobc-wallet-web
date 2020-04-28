import { Component, OnInit } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import zoobc, { getZBCAdress, TransactionListParams, toTransactionListWallet } from 'zoobc-sdk';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MultisigInfoComponent } from './multisig-info/multisig-info.component';
import { onCopyText } from 'src/helpers/utils';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  currAcc: SavedAccount;
  accounts: SavedAccount[];

  constructor(private authServ: AuthService, public dialog: MatDialog) {
    this.currAcc = this.authServ.getCurrAccount();
  }

  ngOnInit() {}

  onOpenMultisigInfoDialog() {
    this.dialog.open(MultisigInfoComponent, {
      width: '300px',
    });
  }
}
