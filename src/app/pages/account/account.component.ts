// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

//     2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
// contact us at roberto.capodieci[at]blockchainzoo.com
// and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MultisigInfoComponent } from './multisig-info/multisig-info.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import Swal from 'sweetalert2';
import { AccountDatasetComponent } from '../account-dataset/account-dataset.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  currAcc: SavedAccount;
  accounts: SavedAccount[];
  @ViewChild('fileInput') myInputVariable: ElementRef;

  constructor(
    private authServ: AuthService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.refreshAccounts();
  }

  ngOnInit() {}

  onOpenAddAccount() {
    const dialog = this.dialog.open(AddAccountComponent, {
      width: '700px',
      maxHeight: '99vh',
    });

    dialog.afterClosed().subscribe((added: boolean) => {
      if (added) {
        this.refreshAccounts();
      }
    });
  }

  onOpenEditAccount(account: SavedAccount) {
    const dialog = this.dialog.open(EditAccountComponent, {
      width: '360px',
      maxHeight: '99vh',
      data: account,
    });
    dialog.afterClosed().subscribe((edited: boolean) => {
      if (edited) {
        this.refreshAccounts();
      }
    });
  }

  async onSwitchAccount(account: SavedAccount) {
    this.authServ.switchAccount(account);
    this.currAcc = account;

    let message = getTranslation('account selected', this.translate, { account: this.currAcc.name });
    this.snackbar.open(message, null, { duration: 3000 });
  }

  onOpenMultisigInfoDialog(account: SavedAccount) {
    this.dialog.open(MultisigInfoComponent, {
      width: '360px',
      maxHeight: '90vh',
      data: account,
    });
  }

  onImportAccount() {
    this.myInputVariable.nativeElement.click();
  }

  refreshAccounts() {
    this.accounts = this.authServ.getAllAccount();
    this.currAcc = this.authServ.getCurrAccount();
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    if (file == undefined) return null;
    fileReader.readAsText(file, 'JSON');
    fileReader.onload = async () => {
      let fileResult = JSON.parse(fileReader.result.toString());
      if (!this.isSavedAccount(fileResult)) {
        const message = getTranslation('you imported the wrong file', this.translate);
        return Swal.fire('Opps...', message, 'error');
      }
      const accountSave: SavedAccount = fileResult;
      const idx = this.authServ.getAllAccount().findIndex(acc => acc.address == accountSave.address);
      if (idx >= 0) {
        let message = getTranslation('account with that address is already exist', this.translate);
        return Swal.fire('Opps...', message, 'error');
      }
      this.authServ.addAccount(accountSave);
      const message = getTranslation('account has been successfully imported', this.translate);
      Swal.fire({
        type: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1000,
      });
      this.refreshAccounts();
    };
    this.myInputVariable.nativeElement.value = '';
  }

  isSavedAccount(obj: any): obj is SavedAccount {
    if ((obj as SavedAccount).type) return true;
    return false;
  }

  async onDelete(index: number) {
    const message = getTranslation('are you sure want to delete this account?', this.translate);
    Swal.fire({
      title: message,
      showCancelButton: true,
      preConfirm: () => {
        const currAccount = this.authServ.getCurrAccount();
        if (this.accounts[index].address == currAccount.address) this.onSwitchAccount(this.accounts[0]);
        this.accounts.splice(index, 1);
        localStorage.setItem('ACCOUNT', JSON.stringify(this.accounts));
        return true;
      },
    });
  }

  onOpenAccDataSet(account: SavedAccount) {
    this.dialog.open(AccountDatasetComponent, {
      width: '400px',
      maxHeight: '99vh',
      data: account,
    });
  }
}
