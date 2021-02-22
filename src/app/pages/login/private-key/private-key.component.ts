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

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import * as wif from 'wif';
import { getZBCAddress, ZooKeyring } from 'zbc-sdk';

@Component({
  selector: 'app-private-key',
  templateUrl: './private-key.component.html',
})
export class PrivateKeyComponent {
  form: FormGroup;
  privKeyField = new FormControl('', Validators.required);

  constructor(
    private authServ: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<PrivateKeyComponent>
  ) {
    this.form = new FormGroup({
      privateKey: this.privKeyField,
    });
  }

  onLogin() {
    if (this.form.valid) {
      const bip = wif.decode(this.privKeyField.value);
      const keyring = new ZooKeyring('');
      const seed = keyring.generateBip32ExtendedKey('ed25519', bip);
      const address = getZBCAddress(seed.publicKey);

      const account: SavedAccount = {
        name: 'Imported Account',
        address: { type: 0, value: address },
        type: 'one time login',
      };
      if (this.authServ.loginWithoutPin(account, seed)) {
        this.dialogRef.close();
        this.router.navigateByUrl('/dashboard');
      }
    }
  }
}
