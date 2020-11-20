import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import zoobc, {
  Escrow,
  ApprovalEscrowTransactionResponse,
  EscrowApprovalInterface,
  EscrowApproval,
  AccountBalance,
} from 'zoobc-sdk';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { environment } from 'src/environments/environment';
import { getTranslation } from 'src/helpers/utils';
import { FormGroup } from '@angular/forms';
import {
  createEscrowApprovalForm,
  escrowApprovalMap,
} from 'src/app/components/transaction-form/form-escrow-approval/form-escrow-approval.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-escrow-transactions',
  templateUrl: './escrow-transaction.component.html',
  styleUrls: ['./escrow-transaction.component.scss'],
})
export class EscrowTransactionComponent implements OnInit {
  @Input() escrowTransactionsData;
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Input() withDetail: boolean = false;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  @Output() detailEscrowMap: EventEmitter<Escrow> = new EventEmitter();
  @Output() dismiss: EventEmitter<boolean> = new EventEmitter();

  form: FormGroup;
  minFee = environment.fee;
  isLoadingDetail: boolean = false;
  isLoadingApproveTx: boolean = false;
  isLoadingRejectTx: boolean = false;
  account: SavedAccount;
  accountBalance: AccountBalance;
  escrowApprovalMap = escrowApprovalMap;

  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private authServ: AuthService,
    @Inject(DOCUMENT) private document
  ) {
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
        .then(
          (res: ApprovalEscrowTransactionResponse) => {
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
          },
          err => {
            this.isLoadingApproveTx = false;
            console.log('err', err);
            let message = getTranslation(err.message, this.translate);
            Swal.fire('Opps...', message, 'error');
          }
        )
        .finally(() => {
          this.onDismiss();
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
      this.isLoadingRejectTx = true;
      const data: EscrowApprovalInterface = {
        approvalAddress: this.account.address,
        fee: feeForm.value,
        approvalCode: EscrowApproval.REJECT,
        transactionId: transactionIdForm.value,
      };
      const childSeed = this.authServ.seed;
      zoobc.Escrows.approval(data, childSeed)
        .then(
          (res: ApprovalEscrowTransactionResponse) => {
            this.isLoadingRejectTx = false;
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
          },
          err => {
            this.isLoadingRejectTx = false;
            console.log('err', err);
            let message = getTranslation(err.message, this.translate);
            Swal.fire('Opps...', message, 'error');
          }
        )
        .finally(() => {
          this.onDismiss();
        });
    } else {
      let message = getTranslation('your balances are not enough for this transaction', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  onDismiss() {
    this.dismiss.emit(true);
  }
}
