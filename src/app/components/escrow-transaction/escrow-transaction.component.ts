import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import zoobc, {
  EscrowTransactionResponse,
  ApprovalEscrowTransactionResponse,
  EscrowApprovalInterface,
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

  constructor(public dialog: MatDialog, private translate: TranslateService, private authServ: AuthService) {}

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    this.waitingList = JSON.parse(localStorage.getItem('WAITING_LIST')) || [];
    if (this.waitingList.length > 50) {
      const reset = [];
      localStorage.setItem('WAITING_LIST', JSON.stringify(reset));
    }
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

  async onConfirm(id) {
    const checkWaitList = this.waitingList.includes(id);
    if (this.account.balance / 1e8 >= this.minFee) {
      if (checkWaitList != true) {
        this.isLoadingTx = true;
        const data: EscrowApprovalInterface = {
          approvalAddress: this.account.address,
          fee: this.minFee,
          approvalCode: 0,
          transactionId: id,
        };
        const childSeed = this.authServ.seed;
        zoobc.Escrows.approval(data, childSeed)
          .then(
            async (res: ApprovalEscrowTransactionResponse) => {
              this.isLoadingTx = false;
              let message = await getTranslation('Transaction has been approved', this.translate);
              Swal.fire({
                type: 'success',
                title: message,
                showConfirmButton: false,
                timer: 1500,
              });
              this.waitingList.push(id);
              localStorage.setItem('WAITING_LIST', JSON.stringify(this.waitingList));
            },
            async err => {
              this.isLoadingTx = false;
              console.log('err', err);
              let message = await getTranslation(
                'An error occurred while processing your request',
                this.translate
              );
              Swal.fire('Opps...', message, 'error');
            }
          )
          .finally(() => {
            this.closeDialog(), this.onRefresh();
          });
      } else {
        let message = await getTranslation('Transaction has been processed', this.translate);
        Swal.fire({
          type: 'info',
          title: message,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.closeDialog(), this.onRefresh();
        });
      }
    } else {
      let message = await getTranslation('Your balances are not enough for this transaction', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  async onReject(id) {
    const checkWaitList = this.waitingList.includes(id);
    if (this.account.balance / 1e8 >= this.minFee) {
      if (checkWaitList != true) {
        this.isLoadingTx = true;
        const data: EscrowApprovalInterface = {
          approvalAddress: this.account.address,
          fee: this.minFee,
          approvalCode: 1,
          transactionId: id,
        };
        const childSeed = this.authServ.seed;
        zoobc.Escrows.approval(data, childSeed)
          .then(
            async (res: ApprovalEscrowTransactionResponse) => {
              this.isLoadingTx = false;
              let message = await getTranslation('Transaction has been rejected', this.translate);
              Swal.fire({
                type: 'success',
                title: message,
                showConfirmButton: false,
                timer: 1500,
              });
              this.waitingList.push(id);
              localStorage.setItem('WAITING_LIST', JSON.stringify(this.waitingList));
            },
            async err => {
              this.isLoadingTx = false;
              console.log('err', err);
              let message = await getTranslation(
                'An error occurred while processing your request',
                this.translate
              );
              Swal.fire('Opps...', message, 'error');
            }
          )
          .finally(() => {
            this.closeDialog(), this.onRefresh();
          });
      } else {
        let message = await getTranslation('Transaction has been processed', this.translate);
        Swal.fire({
          type: 'info',
          title: message,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.closeDialog(), this.onRefresh();
        });
      }
    } else {
      let message = await getTranslation('Your balances are not enough for this transaction', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }
}
