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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { onCopyText, getTranslation } from '../../../helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { ZooKeyring } from 'zbc-sdk';

interface Languages {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
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
  passphrase: string[];

  formTerms: FormGroup;
  isWrittenDown = new FormControl(false, Validators.required);
  isAgree = new FormControl(false, Validators.required);

  location: 'signup' | 'protect your fund' | 'what a seedphrase';

  constructor(private router: Router, private snackbar: MatSnackBar, private translate: TranslateService) {
    this.formTerms = new FormGroup({
      isWrittenDown: this.isWrittenDown,
      isAgree: this.isAgree,
    });
  }

  ngOnInit() {
    this.generateNewWallet();
    this.location = 'protect your fund';
  }

  selectMnemonicLanguage(index: number) {
    this.selectedLang = index;
    this.generateNewWallet();
  }

  generateNewWallet() {
    const lang = this.languages[this.selectedLang].value;
    let phrase = ZooKeyring.generateRandomPhrase(24, lang);
    if (lang === 'japanese') this.passphrase = phrase.split(`${String.fromCharCode(12288)}`);
    else this.passphrase = phrase.split(' ');
  }

  async copyPassphrase() {
    const passphrase = this.passphrase.join(' ');
    let strCopy = 'This is your ZooBC passphrase:\n\n With order number\n-------------------------\n';
    for (let i = 0; i < this.passphrase.length; i++) {
      strCopy += i + 1 + '.' + this.passphrase[i];
      if (i < 23) strCopy += ',   ';
      if ((i + 1) % 3 === 0) strCopy += '\n';
    }
    strCopy += '\n\nWithout order number\n-------------------------\n' + passphrase;
    strCopy += '\n\n----------- End ----------\n\n';
    onCopyText(strCopy);

    let message = getTranslation('seed phrase copied', this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
  }

  goToConfirmPage() {
    this.router.navigate(['confirm-passphrase'], {
      state: { passphrase: this.passphrase },
    });
  }

  next() {
    if (this.location == 'protect your fund') return (this.location = 'what a seedphrase');
    return (this.location = 'signup');
  }
}
