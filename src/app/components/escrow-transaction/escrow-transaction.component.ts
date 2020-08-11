import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import zoobc, {
  EscrowTransactionResponse,
  ApprovalEscrowTransactionResponse,
  EscrowApprovalInterface,
  EscrowApproval,
  AccountBalanceResponse,
} from 'zoobc-sdk';
import { AuthService } from 'src/app/services/auth.service';
import { PinConfirmationComponent } from '../pin-confirmation/pin-confirmation.component';
import { environment } from 'src/environments/environment';
import { getTranslation } from 'src/helpers/utils';

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

  escrowDetail: EscrowTransactionResponse;
  isLoadingDetail: boolean = false;
  isLoadingTx: boolean = false;
  waitingList = [];
  account;
  minFee = environment.fee;
  accountBalance: any;

  constructor(public dialog: MatDialog, private translate: TranslateService, private authServ: AuthService) {}

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
  }

  onRefresh() {
    this.refresh.emit(true);
  }

  openDetail(id) {
    this.isLoadingDetail = true;
    zoobc.Escrows.get(id).then((res: EscrowTransactionResponse) => {
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

  onOpenPinDialog(id, approvalCode) {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });
    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        if (approvalCode == 0) {
          this.onConfirm(id);
        } else {
          this.onReject(id);
        }
      }
    });
  }

  async getBalance() {
    await zoobc.Account.getBalance(this.account.address).then((data: AccountBalanceResponse) => {
      this.accountBalance = data.accountbalance;
    });
  }

  async onConfirm(id) {
    await this.getBalance();
    const balance = parseInt(this.accountBalance.spendablebalance) / 1e8;
    if (balance >= this.minFee) {
      this.isLoadingTx = true;
      const data: EscrowApprovalInterface = {
        approvalAddress: this.account.address,
        fee: this.minFee,
        approvalCode: EscrowApproval.APPROVE,
        transactionId: id,
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
            this.escrowTransactionsData = this.escrowTransactionsData.filter(tx => tx.id != id);
          },
          err => {
            this.isLoadingTx = false;
            console.log('err', err);
            let message = getTranslation('an error occurred while processing your request', this.translate);
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

  async onReject(id) {
    await this.getBalance();
    const balance = parseInt(this.accountBalance.spendablebalance) / 1e8;
    if (balance >= this.minFee) {
      this.isLoadingTx = true;
      const data: EscrowApprovalInterface = {
        approvalAddress: this.account.address,
        fee: this.minFee,
        approvalCode: EscrowApproval.REJECT,
        transactionId: id,
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
            this.escrowTransactionsData = this.escrowTransactionsData.filter(tx => tx.id != id);
          },
          err => {
            this.isLoadingTx = false;
            console.log('err', err);
            let message = getTranslation('an error occurred while processing your request', this.translate);
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
}
