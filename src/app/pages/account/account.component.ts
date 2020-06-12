import { Component, OnInit } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MultisigInfoComponent } from './multisig-info/multisig-info.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { getTranslation } from 'src/helpers/utils';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  currAcc: SavedAccount;
  accounts: SavedAccount[];

  constructor(
    private authServ: AuthService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private activeRoute: ActivatedRoute
  ) {
    this.currAcc = this.authServ.getCurrAccount();
    this.accounts = this.authServ.getAllAccount();
  }

  ngOnInit() {
    if (this.activeRoute.snapshot.params['accountBase64']) {
      const accountBase64: string = this.activeRoute.snapshot.params['accountBase64'];
      const accountStr = atob(accountBase64);
      const account: SavedAccount = JSON.parse(accountStr);
      setTimeout(() => {
        this.onOpenAddAccount(account);
      }, 50);
    }
  }

  onOpenAddAccount(account: SavedAccount = null) {
    const dialog = this.dialog.open(AddAccountComponent, {
      width: '360px',
      maxHeight: '99vh',
      data: account,
    });

    dialog.afterClosed().subscribe((added: boolean) => {
      if (added) {
        this.accounts = this.authServ.getAllAccount();
        this.currAcc = this.authServ.getCurrAccount();
      }
    });
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

  async onSwitchAccount(e, account: SavedAccount) {
    e.stopPropagation();
    this.authServ.switchAccount(account);
    this.currAcc = account;

    let message = await getTranslation(`${this.currAcc.name} selected`, this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
  }

  onOpenMultisigInfoDialog(e, account: SavedAccount) {
    e.stopPropagation();
    this.dialog.open(MultisigInfoComponent, {
      width: '300px',
      data: account,
    });
  }
}
