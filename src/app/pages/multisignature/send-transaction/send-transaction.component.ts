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

import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { getTranslation } from 'src/helpers/utils';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import zoobc, {
  MultiSigInterface,
  MultisigPostTransactionResponse,
  AccountBalance,
  isZBCAddressValid,
  getZBCAddress,
} from 'zbc-sdk';
import { createInnerTxBytes, getTxType } from 'src/helpers/multisig-utils';

@Component({
  selector: 'app-send-transaction',
  templateUrl: './send-transaction.component.html',
  styleUrls: ['./send-transaction.component.scss'],
})
export class SendTransactionComponent implements OnInit {
  @ViewChild('confirmDialog') confirmDialog: TemplateRef<any>;
  @Input() isPopupDialog: boolean = false;
  confirmRefDialog: MatDialogRef<any>;

  account: SavedAccount;
  participants = [];
  innerTx: any[] = [];

  formSend: FormGroup;
  minFee = environment.fee;
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);

  advancedMenu: boolean = false;

  multisig: MultiSigDraft;
  multisigSubs: Subscription;
  txType: string = '';
  isLoading: boolean = false;

  mutisigMap = {
    fee: 'fee',
  };

  constructor(
    private authServ: AuthService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private router: Router,
    private multisigServ: MultisigService,
    private location: Location
  ) {
    this.formSend = new FormGroup({
      fee: this.feeForm,
    });
  }

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      this.multisig = multisig;
    });
    if (this.multisig.multisigInfo === undefined) return this.router.navigate(['/multisignature']);
    this.participants = this.multisig.multisigInfo.participants.map(pc => pc.value);
  }

  back() {
    this.location.back();
  }

  ngOnDestroy() {
    this.multisigSubs.unsubscribe();
    // this.authServ.switchMultisigAccount();
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.authServ.switchAccount(account, true);
  }

  async onOpenConfirmDialog() {
    const balance = await this.getBalance();
    if (balance >= this.minFee) {
      this.fillDialog();
      this.confirmRefDialog = this.dialog.open(this.confirmDialog, {
        width: '500px',
        maxHeight: '90vh',
      });
    } else {
      let message = getTranslation('your balances are not enough for this transaction', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  async getBalance(): Promise<number> {
    const balance = await zoobc.Account.getBalance(this.account.address).then((data: AccountBalance) => data);
    return balance.spendableBalance / 1e8;
  }

  async onConfirm() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });

    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        this.confirmRefDialog.close();
        this.onSendMultiSignatureTransaction();
      }
    });
  }

  async onSendMultiSignatureTransaction() {
    const { multisigInfo, signaturesInfo } = this.multisig;
    const unisgnedTransactions =
      (this.multisig.unisgnedTransactions && Buffer.from(this.multisig.unisgnedTransactions)) ||
      createInnerTxBytes(this.multisig.txBody, this.multisig.txType);

    const data: MultiSigInterface = {
      accountAddress: this.account.address,
      fee: this.feeForm.value,
      multisigInfo,
      unisgnedTransactions: unisgnedTransactions,
      signaturesInfo,
    };

    const childSeed = this.authServ.seed;
    zoobc.MultiSignature.postTransaction(data, childSeed)
      .then(async (res: MultisigPostTransactionResponse) => {
        let message = getTranslation('your transaction is processing', this.translate);
        let subMessage = getTranslation('please tell the participant to approve it', this.translate);
        this.multisigServ.deleteDraft(this.multisig.id);
        Swal.fire(message, subMessage, 'success');
        this.router.navigateByUrl('/dashboard');
      })
      .catch(async err => {
        console.log(err.message);
        let message = getTranslation(err.message, this.translate);
        Swal.fire('Opps...', message, 'error');
      });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  fillDialog() {
    this.txType = getTxType(this.multisig.txType);
    this.innerTx = Object.keys(this.multisig.txBody).map(key => {
      const item = this.multisig.txBody;
      return {
        key,
        value: item[key],
        isAddress: isZBCAddressValid(item[key], 'ZBC'),
      };
    });
  }
}
