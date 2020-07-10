import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import zoobc, { TransactionType, TransactionsResponse, TransactionListParams } from 'zoobc-sdk';

@Component({
  selector: 'app-multisig-approval-history',
  templateUrl: './multisig-approval-history.component.html',
  styleUrls: ['./multisig-approval-history.component.scss'],
})
export class MultisigApprovalHistoryComponent implements OnInit {
  page: number = 1;
  perPage: number = 10;
  total: number = 0;
  address: string;
  isLoading: boolean = false;
  isError: boolean = false;
  multisigHistory: any[];

  constructor(private authServ: AuthService) {}

  ngOnInit() {
    this.address = this.authServ.getCurrAccount().signByAddress || this.authServ.getCurrAccount().address;
    this.getMultiSigTransaction();
  }

  getMultiSigTransaction(reload: boolean = false) {
    if (this.isLoading) return;
    const perPage = Math.ceil(window.outerHeight / 72);

    if (reload) {
      this.multisigHistory = null;
      this.page = 1;
    }

    this.isLoading = true;
    this.isError = false;

    const txParam: TransactionListParams = {
      address: this.address,
      transactionType: TransactionType.MULTISIGNATURETRANSACTION,
      pagination: {
        page: this.page,
        limit: perPage,
      },
    };

    zoobc.Transactions.getList(txParam).then((res: TransactionsResponse) => {
      console.log(res);
    });
  }
}
