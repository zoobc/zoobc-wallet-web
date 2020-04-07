import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import zoobc from 'zoobc-sdk';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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

  escrowDetail: object;
  waitingList = [];
  account;

  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private authServ: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    this.waitingList = JSON.parse(localStorage.getItem('WAITING_LIST')) || [];
    if (this.waitingList.length > 50) {
      const reset = [];
      localStorage.setItem('WAITING_LIST', JSON.stringify(reset));
    }
  }

  openDetail(id) {
    zoobc.Escrows.get(id)
      .then(res => {
        this.escrowDetail = res;
      })
      .finally(() => {
        this.detailEscrowRefDialog = this.dialog.open(this.detailEscrow, {
          width: '500px',
        });
      });
  }

  closeDialog() {
    this.detailEscrowRefDialog.close();
  }

  async onConfirm(id) {
    const checkWaitList = this.waitingList.includes(id);
    if (checkWaitList != true) {
      const data = {
        approvalAddress: this.account.address,
        fee: 1,
        approvalCode: 0,
        transactionId: id,
      };
      const childSeed = this.authServ.getSeed;
      zoobc.Escrows.approval(data, childSeed)
        .then(
          async res => {
            this.isLoading = false;
            let message: string;
            await this.translate
              .get('Transaction has been approved')
              .toPromise()
              .then(res => (message = res));
            Swal.fire({
              type: 'success',
              title: message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.waitingList.push(id);
            localStorage.setItem(
              'WAITING_LIST',
              JSON.stringify(this.waitingList)
            );
            this.router.navigateByUrl('/dashboard');
          },
          async err => {
            this.isLoading = false;
            console.log('err', err);
            let message: string;
            await this.translate
              .get('An error occurred while processing your request')
              .toPromise()
              .then(res => (message = res));
            Swal.fire('Opps...', message, 'error');
          }
        )
        .finally(() => this.closeDialog());
    } else {
      let message: string;
      await this.translate
        .get('Transaction have been processed')
        .toPromise()
        .then(res => (message = res));
      Swal.fire({
        type: 'info',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => this.closeDialog());
    }
  }

  async onReject(id) {
    const checkWaitList = this.waitingList.includes(id);
    if (checkWaitList != true) {
      const data = {
        approvalAddress: this.account.address,
        fee: 1,
        approvalCode: 1,
        transactionId: id,
      };
      const childSeed = this.authServ.getSeed;
      zoobc.Escrows.approval(data, childSeed)
        .then(
          async res => {
            this.isLoading = false;
            let message: string;
            await this.translate
              .get('Transaction has been rejected')
              .toPromise()
              .then(res => (message = res));
            Swal.fire({
              type: 'success',
              title: message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.waitingList.push(id);
            localStorage.setItem(
              'WAITING_LIST',
              JSON.stringify(this.waitingList)
            );
            this.router.navigateByUrl('/dashboard');
          },
          async err => {
            this.isLoading = false;
            console.log('err', err);
            let message: string;
            await this.translate
              .get('An error occurred while processing your request')
              .toPromise()
              .then(res => (message = res));
            Swal.fire('Opps...', message, 'error');
          }
        )
        .finally(() => this.closeDialog());
    } else {
      let message: string;
      await this.translate
        .get('Transaction have been processed')
        .toPromise()
        .then(res => (message = res));
      Swal.fire({
        type: 'info',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => this.closeDialog());
    }
  }
}
