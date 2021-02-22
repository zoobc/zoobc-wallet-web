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

import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { signTransactionHash } from 'zbc-sdk';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { getTranslation, stringToBuffer } from 'src/helpers/utils';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-participants',
  templateUrl: './add-participants.component.html',
})
export class AddParticipantsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  transactionHashField = new FormControl('', Validators.required);
  participantsSignatureField = new FormArray([]);

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  account: SavedAccount;
  participants = [];
  getSignature: boolean = false;
  isSendDialog: boolean = false;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private authServ: AuthService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<AddParticipantsComponent>,
    @Inject(MAT_DIALOG_DATA) data: MultiSigDraft
  ) {
    this.form = new FormGroup({
      transactionHash: this.transactionHashField,
      participantsSignature: this.participantsSignatureField,
    });

    this.multisig = data;
  }

  ngOnInit() {
    if (this.multisig.signaturesInfo === undefined) return this.router.navigate(['/multisignature']);
    this.patchValue(this.multisig);
    this.participants = this.multisig.multisigInfo.participants.map(pc => pc.value);
  }

  ngOnDestroy() {
    if (this.multisigSubs) this.multisigSubs.unsubscribe();
  }

  createParticipant(address: string, signature: string, required: boolean): FormGroup {
    let validator = Validators.required;
    if (!required) validator = null;
    return this.formBuilder.group({
      address: [address, validator],
      signature: [signature, validator],
    });
  }

  patchValue(multisig: MultiSigDraft) {
    const { signaturesInfo } = multisig;
    this.transactionHashField.patchValue(signaturesInfo.txHash);
    this.patchParticipant(signaturesInfo.participants);
  }

  patchParticipant(participant: any[]) {
    participant.forEach(pcp => {
      let address: string = '';
      let signature: string = '';
      if (typeof pcp === 'object') {
        address = pcp.address.value;
        signature = Buffer.from(pcp.signature).toString('base64');
      } else address = pcp;
      this.participantsSignatureField.push(this.createParticipant(address, signature, false));
    });
  }

  updateMultiStorage() {
    const { transactionHash, participantsSignature } = this.form.value;

    const multisig = { ...this.multisig };
    const newPcp = participantsSignature.map(pcp => {
      pcp.signature = stringToBuffer(pcp.signature);
      return {
        address: { value: pcp.address, type: 0 },
        signature: pcp.signature,
      };
    });

    multisig.signaturesInfo = {
      txHash: transactionHash,
      participants: newPcp,
    };

    this.multisigServ.update(multisig);
  }

  onBack() {
    this.location.back();
  }

  async onNext() {
    const signatures = this.participantsSignatureField.value.filter(
      sign => sign.signature !== null && sign.signature.length > 0
    );
    if (signatures.length > 0) {
      const { txHash } = this.multisig.signaturesInfo;
      this.transactionHashField.patchValue(txHash);
      this.updateMultiStorage();
      this.isSendDialog = true;
      return true;
    }
    let message = getTranslation('at least 1 signature must be filled', this.translate);
    Swal.fire('Error', message, 'error');
  }

  onSave() {
    this.updateMultiStorage();
    if (this.multisig.id == 0) {
      this.multisigServ.saveDraft();
    } else {
      this.multisigServ.editDraft();
    }
    this.dialogRef.close(true);
  }

  onAddSignature() {
    const { txHash, participants } = this.multisig.signaturesInfo;
    let idx: number;
    idx = participants.findIndex(pcp => pcp.address.value == this.account.address.value);

    if (this.account.type === 'multisig' && idx == -1)
      idx = participants.findIndex(pcp => pcp.address.value == this.account.address.value);
    let message = getTranslation('this account is not in participant list', this.translate);
    if (idx == -1) return Swal.fire('Error', message, 'error');
    const seed = this.authServ.seed;
    const signature = signTransactionHash(txHash, seed);

    this.participantsSignatureField.controls[idx].get('signature').patchValue(signature.toString('base64'));
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.authServ.switchAccount(account, true);
  }

  toggleGetSignature() {
    this.getSignature = !this.getSignature;
  }
}
