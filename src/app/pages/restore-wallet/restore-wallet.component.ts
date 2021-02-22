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

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { PinSetupDialogComponent } from 'src/app/components/pin-setup-dialog/pin-setup-dialog.component';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import zoobc, { ZooKeyring, getZBCAddress, parseAddress } from 'zbc-sdk';
import { getTranslation } from 'src/helpers/utils';

interface Languages {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-restore-wallet',
  templateUrl: './restore-wallet.component.html',
  styleUrls: ['./restore-wallet.component.scss'],
})
export class RestoreWalletComponent implements OnInit {
  languages: Languages[] = [
    { value: 'chinese_simplified', viewValue: 'Chinese Simplified' },
    { value: 'english', viewValue: 'English' },
    { value: 'japanese', viewValue: 'Japanese' },
    { value: 'spanish', viewValue: 'Spanish' },
    { value: 'italian', viewValue: 'Italian' },
    { value: 'french', viewValue: 'French' },
    { value: 'korean', viewValue: 'Korean' },
    { value: 'chinese_traditional', viewValue: 'Chinese Traditional' },
  ];

  selectedLang: number = 1;
  mnemonicNumWords = environment.mnemonicNumWords;

  restoreForm: FormGroup;
  passphraseField = new FormControl('', Validators.required);
  errorOpenWallet: boolean = false;

  wordField: FormArray;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authServ: AuthService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.restoreForm = this.fb.group({ words: this.fb.array([]) });
  }

  ngOnInit() {
    this.onLoad24Passphrase();
  }

  onLoad24Passphrase(phrase: string[] = []) {
    for (let i = 0; i < this.mnemonicNumWords; i++) {
      this.wordField = this.restoreForm.get('words') as FormArray;
      this.wordField.push(this.fb.group({ word: [phrase[i], Validators.required] }));
    }
  }

  validatePassphrase(passphrase: string) {
    const arrayPhrase = passphrase.split(' ');
    const lang = this.languages[this.selectedLang].value;
    const valid = ZooKeyring.isPassphraseValid(passphrase, lang);

    this.wordField.controls = [];
    this.onLoad24Passphrase(arrayPhrase);
    if (!valid) {
      setTimeout(() => {
        this.restoreForm.setErrors({ mnemonic: true });
      }, 50);
    }
  }

  selectMnemonicLanguage(index: number) {
    let passphrase: string = this.restoreForm.value.words.map(form => form.word).join(' ');
    this.selectedLang = index;
    this.validatePassphrase(passphrase);
  }

  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let passphrase = clipboardData.getData('text').toLowerCase();
    this.validatePassphrase(passphrase);
  }

  onClearPassphrase() {
    this.wordField.controls = [];
    this.onLoad24Passphrase();
  }

  onChangeMnemonic() {
    let passphrase: string = this.restoreForm.value.words.map(form => form.word).join(' ');
    const lang = this.languages[this.selectedLang].value;
    const valid = ZooKeyring.isPassphraseValid(passphrase, lang);
    if (!valid) this.restoreForm.setErrors({ mnemonic: true });
  }

  async onRestore() {
    if (this.restoreForm.valid) {
      if (localStorage.getItem('ENC_MASTER_SEED')) {
        const message = getTranslation('your old wallet will be removed from this device', this.translate);
        Swal.fire({
          title: message,
          confirmButtonText: 'Continue',
          showCancelButton: true,
          showLoaderOnConfirm: true,
          preConfirm: () => {
            this.openPinDialog();
            return true;
          },
        });
      } else this.openPinDialog();
    }
  }

  openPinDialog() {
    let pinDialog = this.dialog.open(PinSetupDialogComponent, {
      width: '400px',
      maxHeight: '90vh',
      disableClose: true,
    });
    pinDialog.afterClosed().subscribe((key: string) => {
      this.saveNewAccount(key);
    });
  }

  async saveNewAccount(key: string) {
    let passphrase: string = this.restoreForm.value.words.map(form => form.word).join(' ');

    const encPassphrase = zoobc.Wallet.encryptPassphrase(passphrase, key);
    const keyring = new ZooKeyring(passphrase);
    const childSeed = keyring.calcDerivationPath(0);
    const address = getZBCAddress(childSeed.publicKey);
    const account: SavedAccount = {
      name: 'Account 1',
      path: 0,
      type: 'normal',
      nodeIP: null,
      address: { value: address, type: 0 },
    };

    localStorage.removeItem('ACCOUNT');
    localStorage.removeItem('CURR_ACCOUNT');
    localStorage.setItem('ENC_PASSPHRASE_SEED', encPassphrase);
    localStorage.setItem('ACCOUNT', JSON.stringify([account]));
    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
    localStorage.setItem('IS_RESTORED', 'false');

    this.authServ.login(key);
    this.router.navigate(['dashboard']);
  }
}
