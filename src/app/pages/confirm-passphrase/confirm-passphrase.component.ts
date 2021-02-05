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

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PinSetupDialogComponent } from 'src/app/components/pin-setup-dialog/pin-setup-dialog.component';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import zoobc, { ZooKeyring, getZBCAddress } from 'zbc-sdk';
import { Location } from '@angular/common';

@Component({
  selector: 'app-confirm-passphrase',
  templateUrl: './confirm-passphrase.component.html',
  styleUrls: ['./confirm-passphrase.component.scss'],
})
export class ConfirmPassphraseComponent implements OnInit {
  @ViewChildren('firstInput') firstInput: ElementRef;

  words: string;
  passphrase: string[];
  zooKeyring: ZooKeyring;
  confirmForm: FormGroup;
  firstIndex: number;
  secondIndex: number;
  firstWord: FormControl = new FormControl('', Validators.required);
  secondWord: FormControl = new FormControl('', Validators.required);

  constructor(
    private dialog: MatDialog,
    private authServ: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.confirmForm = new FormGroup({
      firstWord: this.firstWord,
      secondWord: this.secondWord,
    });
  }

  ngOnInit() {
    if (!history.state.passphrase) {
      this.location.replaceState('signup');
      this.location.back();
    } else {
      this.words = history.state.passphrase.join(' ');
      this.passphrase = Object.assign([], history.state.passphrase);
      this.randomPassPhrase();
    }
  }

  backClicked() {
    this.location.back();
  }

  randomPassPhrase() {
    let lenWords = this.passphrase.length;
    const first = Math.floor(Math.random() * (lenWords - 1));
    const second = Math.floor(Math.random() * (lenWords - 1));
    this.firstIndex = first;
    this.secondIndex = second;
    if (first > second) {
      this.firstIndex = second;
      this.secondIndex = first;
    }
  }

  checkValid() {
    if (!this.confirmForm.valid) return this.confirmForm.setErrors({ required: true });
    if (
      this.firstWord.value.replace(/\s/g, '').toLowerCase() !== this.passphrase[this.firstIndex] ||
      this.secondWord.value.replace(/\s/g, '').toLowerCase() !== this.passphrase[this.secondIndex]
    ) {
      this.confirmForm.setErrors({ mnemonic: true });
    }
  }

  openCreatePin() {
    if (this.confirmForm.valid) {
      let pinDialog = this.dialog.open(PinSetupDialogComponent, {
        width: '400px',
        maxHeight: '90vh',
        disableClose: true,
      });
      pinDialog.afterClosed().subscribe((key: string) => {
        this.saveNewAccount(key);
        this.router.navigateByUrl('/dashboard');
      });
    }
  }

  saveNewAccount(key: string) {
    this.zooKeyring = new ZooKeyring(this.words);

    const encPassphrase = zoobc.Wallet.encryptPassphrase(this.words, key);
    const childSeed = this.zooKeyring.calcDerivationPath(0);
    const accountAddress = getZBCAddress(childSeed.publicKey);

    const account: SavedAccount = {
      name: 'Account 1',
      type: 'normal',
      path: 0,
      nodeIP: null,
      address: { value: accountAddress, type: 0 },
    };

    localStorage.removeItem('ACCOUNT');
    localStorage.setItem('ENC_PASSPHRASE_SEED', encPassphrase);
    localStorage.setItem('ACCOUNT', JSON.stringify([account]));
    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
    localStorage.setItem('IS_RESTORED', 'false');

    this.authServ.login(key);
  }

  clearInput(name: string) {
    this.confirmForm.get(name).reset();
  }
}
