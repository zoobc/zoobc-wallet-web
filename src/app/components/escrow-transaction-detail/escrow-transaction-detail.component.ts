import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import zoobc from 'zoobc-sdk';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-escrow-transaction-detail',
  templateUrl: './escrow-transaction-detail.component.html',
  styleUrls: ['./escrow-transaction-detail.component.scss'],
})
export class EscrowTransactionDetailComponent implements OnInit {
  transaction: object;
  isLoading: boolean = true;
  account;
  constructor(
    @Inject(MAT_DIALOG_DATA) public id: any,
    public dialog: MatDialog,
    private translate: TranslateService,
    private authServ: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    zoobc.Escrows.get(this.id).then((transaction: object) => {
      this.transaction = transaction;
      this.isLoading = false;
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  async onConfirm(id) {
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
  }

  async onReject(id) {
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
  }
}
