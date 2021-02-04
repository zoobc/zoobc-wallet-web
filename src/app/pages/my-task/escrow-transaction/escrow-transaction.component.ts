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

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import zoobc, {
  Escrow,
  ApprovalEscrowTransactionResponse,
  EscrowApprovalInterface,
  EscrowApproval,
  AccountBalance,
} from 'zbc-sdk';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { environment } from 'src/environments/environment';
import { getTranslation } from 'src/helpers/utils';
import { FormGroup } from '@angular/forms';
import {
  createEscrowApprovalForm,
  escrowApprovalMap,
} from 'src/app/components/transaction-form/form-escrow-approval/form-escrow-approval.component';

@Component({
  selector: 'app-escrow-transactions',
  templateUrl: './escrow-transaction.component.html',
  styleUrls: ['./escrow-transaction.component.scss'],
})
export class EscrowTransactionComponent implements OnInit {
  @Input() escrowTransactionsData: Escrow[];
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  @Output() detailEscrowMap: EventEmitter<Escrow> = new EventEmitter();

  form: FormGroup;
  minFee = environment.fee;
  isLoadingApproveTx: boolean = false;
  account: SavedAccount;
  accountBalance: AccountBalance;
  escrowApprovalMap = escrowApprovalMap;

  constructor(public dialog: MatDialog, private translate: TranslateService, private authServ: AuthService) {
    this.form = createEscrowApprovalForm();
  }

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
  }

  onRefresh() {
    this.refresh.emit(true);
  }

  openDetail(id) {
    this.form.get('sender').patchValue(this.account.address.value);
    this.form.get('transactionId').patchValue(id);
    this.form.get('fee').patchValue(this.minFee);
    zoobc.Escrows.get(id).then((res: Escrow) => {
      this.detailEscrowMap.emit(res);
    });
  }

  onOpenPinDialog(approvalCode) {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });
    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        if (approvalCode == 0) this.onConfirm();
        else this.onReject();
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
          let message = getTranslation('transaction has been approved', this.translate);
          Swal.fire({
            type: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.escrowTransactionsData = this.escrowTransactionsData.filter(
            tx => tx.id != transactionIdForm.value
          );
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
          let message = getTranslation('transaction has been rejected', this.translate);
          Swal.fire({
            type: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.escrowTransactionsData = this.escrowTransactionsData.filter(
            tx => tx.id != transactionIdForm.value
          );
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
