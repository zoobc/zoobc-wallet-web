import { Component, OnInit } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { MultisigInfoComponent } from './multisig-info/multisig-info.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  currAcc: SavedAccount;
  accounts: SavedAccount[];

  constructor(private authServ: AuthService, public dialog: MatDialog, private router: Router) {
    this.currAcc = this.authServ.getCurrAccount();
    this.accounts = this.authServ.getAllAccount();
  }

  ngOnInit() {}

  onOpenAddAccount() {
    this.dialog.open(AddAccountComponent, { width: '360px', maxHeight: '99vh' });
  }

  onOpenEditAccount(e, account: SavedAccount) {
    e.stopPropagation();
    const dialog = this.dialog.open(EditAccountComponent, {
      width: '360px',
      maxHeight: '99vh',
      data: account,
    });
    dialog.afterClosed().subscribe((edited: boolean) => {
      if (edited) {
        this.accounts = this.authServ.getAllAccount();
        this.currAcc = this.authServ.getCurrAccount();
      }
    });
  }

  onSwitchAccount(account: SavedAccount) {
    this.authServ.switchAccount(account);
    this.currAcc = account;
  }

  onOpenMultisigInfoDialog() {
    this.dialog.open(MultisigInfoComponent, {
      width: '300px',
    });
  }
}
