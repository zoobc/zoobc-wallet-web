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
import zoobc, {
  AccountBalance,
  ApprovalEscrowTransactionResponse,
  Escrow,
  EscrowApproval,
  EscrowApprovalInterface,
} from 'zbc-sdk';

@Component({
  selector: 'app-escrow-detail',
  templateUrl: './escrow-detail.component.html',
  styleUrls: ['./escrow-detail.component.scss'],
})
export class EscrowDetailComponent implements OnInit {
  @Input() detail: Escrow;

  form: FormGroup;
  showProcessFormEscrow: boolean = false;
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

  toogleShowProcessFormEscrow() {
    this.showProcessFormEscrow = !this.showProcessFormEscrow;
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
          let message = getTranslation('transaction has been approved', this.translate);
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
          let message = getTranslation('transaction has been rejected', this.translate);
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
