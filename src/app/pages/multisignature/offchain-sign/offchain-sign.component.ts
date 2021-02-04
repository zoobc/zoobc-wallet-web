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

import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MultiSigDraft } from 'src/app/services/multisig.service';
import {
  addressToBytes,
  generateTransactionHash,
  isZBCAddressValid,
  signTransactionHash,
  toBase64Url,
} from 'zbc-sdk';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { onCopyText, getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { getTxType } from 'src/helpers/multisig-utils';

@Component({
  selector: 'app-offchain-sign',
  templateUrl: './offchain-sign.component.html',
  styleUrls: ['./offchain-sign.component.scss'],
})
export class OffchainSignComponent {
  withVerify = true;
  yourTxHash: string;
  isValid: boolean = false;
  isAddressInParticipants: boolean;

  signature: string;
  signatureUrl: string;

  draft: MultiSigDraft;
  innerTx: any[] = [];
  txType: string = '';

  account: SavedAccount;
  participants: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: MultiSigDraft,
    private authServ: AuthService,
    private snackbar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.draft = data;

    this.txType = getTxType(data.txType);
    this.participants = data.multisigInfo.participants.map(pc => pc.value);
    this.innerTx = Object.keys(this.draft.txBody).map(key => {
      const item = this.draft.txBody;
      return {
        key,
        value: item[key],
        isAddress: isZBCAddressValid(item[key], 'ZBC'),
      };
    });
  }

  onVerify() {
    const { txHash } = this.draft.signaturesInfo;
    this.yourTxHash = generateTransactionHash(Buffer.from(this.draft.unisgnedTransactions));
    this.isValid = this.yourTxHash == txHash ? true : false;

    if (this.isValid) {
      let accounts = this.authServ.getAllAccount();
      accounts = accounts.filter(res => this.participants.includes(res.address.value));
      if (accounts.length > 0) this.isAddressInParticipants = true;
      else this.isAddressInParticipants = false;
    }
  }

  onSelectAccount(account: SavedAccount) {
    this.account = account;
  }

  onSign() {
    const seed = this.authServ.seed;
    this.signature = signTransactionHash(this.yourTxHash, seed).toString('base64');

    const signatureBase64Url = toBase64Url(this.signature);
    const address = toBase64Url(addressToBytes(this.account.address).toString('base64'));
    this.signatureUrl = `${window.location.origin}/multisignature/sign/${this.yourTxHash}/${address}/${signatureBase64Url}`;
  }

  async onCopy() {
    onCopyText(this.signatureUrl);
    let message = await getTranslation('Signature copied to clipboard', this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
  }
}
