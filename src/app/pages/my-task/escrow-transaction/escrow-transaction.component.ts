import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog } from '@angular/material';
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

@Component({
  selector: 'app-escrow-transactions',
  templateUrl: './escrow-transaction.component.html',
  styleUrls: ['./escrow-transaction.component.scss'],
})
export class EscrowTransactionComponent implements OnInit {
  @ViewChild('detailEscrow') detailEscrow: TemplateRef<any>;
  @Input() escrowTransactionsData;
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Input() withDetail: boolean = false;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  detailEscrowRefDialog: MatDialogRef<any>;

  form: FormGroup;
  minFee = environment.fee;
  showProcessForm: boolean = false;
  escrowDetail: Escrow;
  isLoadingDetail: boolean = false;
  isLoadingTx: boolean = false;
  waitingList = [];
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
    this.showProcessForm = false;
    this.form.get('sender').patchValue(this.account.address);
    this.form.get('transactionId').patchValue(id);
    this.form.get('fee').patchValue(this.minFee);
    this.isLoadingDetail = true;
    zoobc.Escrows.get(id).then((res: Escrow) => {
      this.escrowDetail = res;
      this.isLoadingDetail = false;
    });
    this.detailEscrowRefDialog = this.dialog.open(this.detailEscrow, {
      width: '500px',
      maxHeight: '90vh',
    });
  }

  closeDialog() {
    this.detailEscrowRefDialog.close();
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
    await zoobc.Account.getBalance({ address: this.account.address, type: 0 }).then(
      (data: AccountBalance) => {
        this.accountBalance = data;
      }
    );
  }

  async onConfirm() {
    const feeForm = this.form.get('fee');
    const transactionIdForm = this.form.get('transactionId');

    await this.getBalance();
    const balance = this.accountBalance.spendableBalance / 1e8;
    if (balance >= feeForm.value) {
      this.isLoadingTx = true;
      const data: EscrowApprovalInterface = {
        approvalAddress: { address: this.account.address, type: 0 },
        fee: feeForm.value,
        approvalCode: EscrowApproval.APPROVE,
        transactionId: transactionIdForm.value,
      };

      const childSeed = this.authServ.seed;
      zoobc.Escrows.approval(data, childSeed)
        .then(
          (res: ApprovalEscrowTransactionResponse) => {
            this.isLoadingTx = false;
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
            this.isLoadingTx = false;
            console.log('err', err);
            let message = getTranslation(err.message, this.translate);
            Swal.fire('Opps...', message, 'error');
          }
        )
        .finally(() => {
          this.closeDialog();
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
      this.isLoadingTx = true;
      const data: EscrowApprovalInterface = {
        approvalAddress: { address: this.account.address, type: 0 },
        fee: feeForm.value,
        approvalCode: EscrowApproval.REJECT,
        transactionId: transactionIdForm.value,
      };
      const childSeed = this.authServ.seed;
      zoobc.Escrows.approval(data, childSeed)
        .then(
          (res: ApprovalEscrowTransactionResponse) => {
            this.isLoadingTx = false;
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
            this.isLoadingTx = false;
            console.log('err', err);
            let message = getTranslation(err.message, this.translate);
            Swal.fire('Opps...', message, 'error');
          }
        )
        .finally(() => {
          this.closeDialog();
        });
    } else {
      let message = getTranslation('your balances are not enough for this transaction', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  toogleShowProcessForm(e) {
    this.showProcessForm = !this.showProcessForm;
  }
}
