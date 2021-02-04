// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

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

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { SavedAccount, AuthService, AccountType } from 'src/app/services/auth.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { AddAccountComponent } from 'src/app/pages/account/add-account/add-account.component';

@Component({
  selector: 'account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.scss'],
})
export class AccountSelectorComponent implements OnInit {
  @ViewChild('accountDialog') accountDialog: TemplateRef<any>;

  @Input() type: AccountType = null;
  @Input() switchAccount: boolean = true;
  @Input() selectedValue: string;
  @Input() addresses?: string[];
  @Input() withBalance: boolean = true;
  @Output() select: EventEmitter<SavedAccount> = new EventEmitter();

  accountRefDialog: MatDialogRef<any>;

  isLoading = false;
  isError = false;

  initAccount: SavedAccount;
  account: SavedAccount;
  accounts: SavedAccount[];

  constructor(private authServ: AuthService, private dialog: MatDialog) {}

  ngOnInit() {
    // this.currencyServ.rate.subscribe(rate => (this.currencyRate = rate));
    this.account = this.initAccount = this.authServ.getCurrAccount();

    this.getAccounts();
  }

  getAccounts() {
    this.isLoading = true;
    this.isError = false;
    this.authServ
      .getAccountsWithBalance(this.type)
      .then((res: SavedAccount[]) => {
        this.accounts = res;
        if (this.addresses) {
          this.accounts = this.accounts.filter(res => this.addresses.includes(res.address.value));
          this.account = this.accounts[0];
        } else if (this.selectedValue) {
          this.account = this.accounts.find(acc => acc.address.value == this.selectedValue);
        } else if (this.switchAccount) {
          this.account = this.accounts.find(acc => this.account.address.value == acc.address.value);
          if (!this.account) this.account = this.accounts[0];
        }

        this.select.emit(this.account);
      })
      .catch(() => (this.isError = true))
      .finally(() => (this.isLoading = false));
  }

  openAccountList() {
    this.accountRefDialog = this.dialog.open(this.accountDialog, {
      width: '380px',
      maxHeight: '90vh',
    });
  }

  openAddAccount() {
    const dialog = this.dialog.open(AddAccountComponent, {
      width: '360px',
      maxHeight: '99vh',
    });

    dialog.afterClosed().subscribe((added: boolean) => {
      if (added) this.getAccounts();
    });
  }

  onSwitchAccount(account: SavedAccount) {
    const onlySeed = this.initAccount.type == 'multisig' ? true : false;
    if (this.switchAccount) this.authServ.switchAccount(account, onlySeed);
    this.account = account;
    this.accountRefDialog.close();
    this.select.emit(account);
  }
}
