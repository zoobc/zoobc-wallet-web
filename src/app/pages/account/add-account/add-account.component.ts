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
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import zoobc, { getZBCAddress, MultiSigInfo, Address } from 'zbc-sdk';
import { uniqueParticipant } from '../../../../helpers/utils';
import Swal from 'sweetalert2';
import { getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss'],
})
export class AddAccountComponent implements OnInit {
  formAddAccount: FormGroup;
  accountNameField = new FormControl('', Validators.required);
  participantsField = new FormArray([], uniqueParticipant);
  nonceField = new FormControl('', [Validators.required, Validators.min(1)]);
  minSignatureField = new FormControl('', [Validators.required, Validators.min(2)]);

  isMultiSignature: boolean = false;
  minParticipant: number = 2;
  account: SavedAccount;

  constructor(
    private authServ: AuthService,
    private dialogRef: MatDialogRef<AddAccountComponent>,
    private translate: TranslateService
  ) {
    this.formAddAccount = new FormGroup({
      name: this.accountNameField,
      participants: this.participantsField,
      nonce: this.nonceField,
      minimumSignature: this.minSignatureField,
    });

    this.pushInitParticipant();
    this.disableFieldMultiSignature();
  }

  ngOnInit() {}

  async onAddAccount() {
    let account: SavedAccount;

    if (!this.isMultiSignature) {
      const keyring = this.authServ.keyring;
      const path = this.authServ.generateDerivationPath();
      const childSeed = keyring.calcDerivationPath(path);
      const accountAddress = getZBCAddress(childSeed.publicKey);
      account = {
        name: this.accountNameField.value,
        type: 'normal',
        path,
        nodeIP: null,
        address: { value: accountAddress, type: 0 },
      };
      this.authServ.addAccount(account);
      return this.dialogRef.close(true);
    }

    const title = getTranslation('are you sure?', this.translate);
    const message = getTranslation(
      'once you create multisignature address, you will not be able to edit it anymore. but you can still delete it',
      this.translate
    );
    const confirmButtonText = getTranslation('yes, continue it!', this.translate);
    const cancelButtonText = getTranslation('cancel', this.translate);
    Swal.fire({
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      type: 'warning',
    }).then(res => {
      if (!res.value) return null;
      let addresses: [string] = this.participantsField.value.filter(value => value.length > 0);
      addresses = addresses.sort();
      const participants: Address[] = addresses.map(address => ({ value: address, type: 0 }));
      const multiParam: MultiSigInfo = {
        participants,
        nonce: this.nonceField.value,
        minSigs: this.minSignatureField.value,
      };
      const multiSignAddress = zoobc.MultiSignature.createMultiSigAddress(multiParam);
      account = {
        name: this.accountNameField.value,
        type: 'multisig',
        path: null,
        nodeIP: null,
        address: { value: multiSignAddress, type: 0 },
        participants: participants,
        nonce: this.nonceField.value,
        minSig: this.minSignatureField.value,
      };
      this.authServ.addAccount(account);
      return this.dialogRef.close(true);
    });
  }

  disableFieldMultiSignature() {
    this.isMultiSignature = false;

    this.participantsField.disable();
    this.nonceField.disable();
    this.minSignatureField.disable();

    const len = this.authServ.getAllAccount('normal').length + 1;
    this.accountNameField.setValue(`Account ${len}`);
  }

  enableFieldMultiSignature() {
    this.isMultiSignature = true;

    this.participantsField.enable();
    this.nonceField.enable();
    this.minSignatureField.enable();

    const len = this.authServ.getAllAccount('multisig').length + 1;
    this.accountNameField.setValue(`Multisig Account ${len}`);
  }

  toogleMultiSignature() {
    if (!this.isMultiSignature) this.enableFieldMultiSignature();
    else this.disableFieldMultiSignature();
  }

  pushInitParticipant(size = 2) {
    for (let i = 0; i < size; i++) {
      if (i < this.minParticipant) this.participantsField.push(new FormControl('', [Validators.required]));
      else this.participantsField.push(new FormControl(''));
    }
  }

  addParticipant() {
    this.participantsField.push(new FormControl(''));
  }

  removeParticipant(index: number) {
    this.participantsField.removeAt(index);
  }
}
