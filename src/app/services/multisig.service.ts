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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { getTranslation } from 'src/helpers/utils';
import Swal from 'sweetalert2';
import zoobc, { MultiSigInterface, TransactionType } from 'zbc-sdk';
import { AuthService, SavedAccount } from './auth.service';

export interface MultiSigDraft extends MultiSigInterface {
  id: number;
  generatedSender?: string;
  txType: number;
  txBody?: any;
}

@Injectable({
  providedIn: 'root',
})
export class MultisigService {
  private multisigTemplate: MultiSigDraft = {
    id: 0,
    accountAddress: null,
    fee: 0,
    txType: TransactionType.SENDMONEYTRANSACTION,
  };

  private sourceMultisig = new BehaviorSubject<MultiSigDraft>({ ...this.multisigTemplate });
  multisig = this.sourceMultisig.asObservable();

  constructor(private authServ: AuthService, private translate: TranslateService, private router: Router) {}

  initDraft(account: SavedAccount, txType: number) {
    const multisig: MultiSigDraft = {
      accountAddress: null,
      fee: 0,
      id: 0,
      multisigInfo: null,
      unisgnedTransactions: null,
      signaturesInfo: null,
      txType,
      txBody: {},
    };

    const isMultiSignature = account.type == 'multisig' ? true : false;
    if (isMultiSignature) {
      const accounts = this.authServ
        .getAllAccount()
        .filter(acc => account.participants.some(address => address.value == acc.address.value));

      // if no address on the participants
      if (accounts.length <= 0) {
        const message = getTranslation('you dont have any account that in participant list', this.translate);
        Swal.fire({ type: 'error', title: 'Oops...', text: message });
        return false;
      }

      multisig.multisigInfo = {
        minSigs: account.minSig,
        nonce: account.nonce,
        participants: account.participants,
      };

      const address = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);
      multisig.txBody.sender = address;

      this.update(multisig);
      this.router.navigate(['/multisignature/create/create-transaction']);
    } else {
      this.update(multisig);
      this.router.navigate(['/multisignature/create/add-multisig-info']);
    }
  }

  update(multisig: MultiSigDraft) {
    this.sourceMultisig.next(multisig);
  }

  getDrafts(): MultiSigDraft[] {
    return JSON.parse(localStorage.getItem('MULTISIG_DRAFTS'));
  }

  saveDraft() {
    let multisigDrafts = this.getDrafts();
    const len = multisigDrafts.length;
    if (this.sourceMultisig.value.id === 0) this.sourceMultisig.value.id = new Date().getTime();
    else {
      this.sourceMultisig.value.id = this.sourceMultisig.value.id;
    }
    multisigDrafts[len] = this.sourceMultisig.value;
    localStorage.setItem('MULTISIG_DRAFTS', JSON.stringify(multisigDrafts));
  }

  editDraft() {
    let multisigDrafts = this.getDrafts();

    for (let i = 0; i < multisigDrafts.length; i++) {
      const multisig = multisigDrafts[i];
      if (multisig.id == this.sourceMultisig.value.id) {
        multisigDrafts[i] = this.sourceMultisig.value;
        localStorage.setItem('MULTISIG_DRAFTS', JSON.stringify(multisigDrafts));
        break;
      }
    }
  }

  deleteDraft(idx: number) {
    let multisigDrafts = this.getDrafts();
    multisigDrafts = multisigDrafts.filter(draft => draft.id != idx);
    localStorage.setItem('MULTISIG_DRAFTS', JSON.stringify(multisigDrafts));
  }
}
