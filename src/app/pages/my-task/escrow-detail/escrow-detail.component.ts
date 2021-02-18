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

import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import {
  createEscrowApprovalForm,
  escrowApprovalMap,
} from 'src/app/components/transaction-form/form-escrow-approval/form-escrow-approval.component';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { getTranslation } from 'src/helpers/utils';
import Swal from 'sweetalert2';
import zoobc, { AccountBalance, Escrow, EscrowApproval, EscrowApprovalInterface } from 'zbc-sdk';

@Component({
  selector: 'app-escrow-detail',
  templateUrl: './escrow-detail.component.html',
  styleUrls: ['./escrow-detail.component.scss'],
})
export class EscrowDetailComponent implements OnInit {
  @Input() detail: Escrow;

  form: FormGroup;
  escrowApprovalMap = escrowApprovalMap;
  isLoadingApproveTx: boolean = false;

  account: SavedAccount;
  accountBalance: AccountBalance;

  constructor(private dialog: MatDialog, private authServ: AuthService, private translate: TranslateService) {
    this.form = createEscrowApprovalForm();
  }

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();

    this.form.get('sender').patchValue(this.account.address.value);
    this.form.get('transactionId').patchValue(this.detail.id);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.form.get('transactionId').patchValue(changes.detail.currentValue.id);
  }

  onOpenPinDialog(approvalCode) {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });
    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        if (approvalCode == 0) {
          this.onConfirm();
        } else {
          this.onReject();
        }
      }
    });
  }

  async getBalance() {
    await zoobc.Account.getBalance(this.account.address).then((data: AccountBalance) => {
      this.accountBalance = data;
    });
  }

  async onConfirm() {
    const feeForm = this.form.get('fee');
    const transactionIdForm = this.form.get('transactionId');

    await this.getBalance();
    const balance = this.accountBalance.spendableBalance / 1e8;
    if (balance >= feeForm.value) {
      this.isLoadingApproveTx = true;
      const data: EscrowApprovalInterface = {
        approvalAddress: this.account.address,
        fee: feeForm.value,
        approvalCode: EscrowApproval.APPROVE,
        transactionId: transactionIdForm.value,
      };

      const childSeed = this.authServ.seed;
      zoobc.Escrows.approval(data, childSeed)
        .then(() => {
          this.isLoadingApproveTx = false;
          const message = getTranslation('transaction has been approved', this.translate);
          Swal.fire({
            type: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch(err => {
          this.isLoadingApproveTx = false;
          console.log('err', err);
          let message = getTranslation(err.message, this.translate);
          Swal.fire('Opps...', message, 'error');
        });
    } else {
      let message = getTranslation('your balances are not enough for this transaction', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  async onReject() {
    const feeForm = this.form.get('fee');
    const transactionIdForm = this.form.get('transactionId');

    await this.getBalance();
    const balance = this.accountBalance.spendableBalance / 1e8;
    if (balance >= feeForm.value) {
      this.isLoadingApproveTx = true;
      const data: EscrowApprovalInterface = {
        approvalAddress: this.account.address,
        fee: feeForm.value,
        approvalCode: EscrowApproval.REJECT,
        transactionId: transactionIdForm.value,
      };
      const childSeed = this.authServ.seed;
      zoobc.Escrows.approval(data, childSeed)
        .then(() => {
          this.isLoadingApproveTx = false;
          const message = getTranslation('transaction has been rejected', this.translate);
          Swal.fire({
            type: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch(err => {
          this.isLoadingApproveTx = false;
          console.log('err', err);
          let message = getTranslation(err.message, this.translate);
          Swal.fire('Opps...', message, 'error');
        });
    } else {
      let message = getTranslation('your balances are not enough for this transaction', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }
}
