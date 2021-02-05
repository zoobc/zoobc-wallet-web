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

import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { getTranslation, stringToBuffer } from 'src/helpers/utils';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { generateTransactionHash } from 'zbc-sdk';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { createInnerTxBytes, createInnerTxForm, getInputMap } from 'src/helpers/multisig-utils';
import { MatDialog, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
})
export class CreateTransactionComponent implements OnInit, OnDestroy {
  @ViewChild('chainDialog') chainDialog: TemplateRef<any>;
  chainRefDialog: MatDialogRef<any>;

  createTransactionForm: FormGroup;

  form: FormGroup;
  chainTypeField = new FormControl('onchain', Validators.required);

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  fieldList: object;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    const subs = this.multisigServ.multisig.subscribe(multisig => {
      this.createTransactionForm = createInnerTxForm(multisig.txType);
      this.fieldList = getInputMap(multisig.txType);
    });
    subs.unsubscribe();

    this.form = new FormGroup({
      chainType: this.chainTypeField,
    });
  }

  ngOnInit() {
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { unisgnedTransactions, txBody } = multisig;
      if (unisgnedTransactions === undefined) this.router.navigate(['/multisignature']);

      this.multisig = multisig;

      const senderForm = this.createTransactionForm.get('sender');
      senderForm.setValue(multisig.txBody.sender);
      if (txBody) this.createTransactionForm.patchValue(txBody);
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.multisigSubs) this.multisigSubs.unsubscribe();
  }

  saveDraft() {
    this.updateCreateTransaction();
    this.multisigServ.saveDraft();
    this.router.navigate(['/multisignature']);
  }

  updateCreateTransaction() {
    const multisig = { ...this.multisig };
    multisig.txBody = this.createTransactionForm.value;
    this.multisigServ.update(multisig);
  }

  onNext() {
    this.chainRefDialog = this.dialog.open(this.chainDialog, {
      width: '380px',
      maxHeight: '90vh',
    });
  }

  async onSelectedChain() {
    if (this.chainTypeField.value == 'onchain') {
      this.updateCreateTransaction();
      this.router.navigate(['/multisignature/create/send-transaction']);
    } else if (this.chainTypeField.value == 'offchain') {
      const title = getTranslation('are you sure?', this.translate);
      const message = getTranslation('you will not be able to update the form anymore!', this.translate);
      const buttonText = getTranslation('yes, continue it!', this.translate);
      const isConfirm = await Swal.fire({
        title: title,
        text: message,
        showCancelButton: true,
        confirmButtonText: buttonText,
        type: 'warning',
      }).then(result => result.value);
      if (!isConfirm) return false;

      this.generateTxHash();
      this.saveDraft();
    }
    this.chainRefDialog.close();
  }

  back() {
    this.location.back();
  }

  generateTxHash() {
    const { multisigInfo, txType } = this.multisig;
    const form = this.createTransactionForm.value;
    const signature = stringToBuffer('');
    const unisgnedTransactions = createInnerTxBytes(form, txType);
    const txHash = generateTransactionHash(unisgnedTransactions);
    const participants = multisigInfo.participants.map(address => ({ address, signature }));

    this.multisig.unisgnedTransactions = unisgnedTransactions;
    this.multisig.signaturesInfo = { txHash, participants };
  }
}
