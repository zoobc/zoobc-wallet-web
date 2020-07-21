import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import zoobc, {
  TransactionType,
  TransactionsResponse,
  TransactionListParams,
  MultisigPendingTxDetailResponse,
  MultisigPendingTxResponse,
  toGetPendingList,
} from 'zoobc-sdk';
import { base64ToHex } from 'src/helpers/utils';
import { MatDialogRef, MatDialog } from '@angular/material';

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
  finished: boolean = false;
  multisigHistory: any[];
  isLoadingDetail: boolean = false;
  transactionDetail: any;
  transactionId: string;

  detailTransactionRefDialog: MatDialogRef<any>;
  @ViewChild('detailTransaction') detailTransactionDialog: TemplateRef<any>;

  constructor(private authServ: AuthService, public dialog: MatDialog) {}

  ngOnInit() {
    this.address = this.authServ.getCurrAccount().signByAddress || this.authServ.getCurrAccount().address;
    this.getMultiSigTransaction(true);
  }

  async getMultiSigTransaction(reload: boolean = false) {
    if (this.isLoading) return;
    const perPage = Math.ceil(window.outerHeight / 50);

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

    try {
      let tx = await zoobc.Transactions.getList(txParam).then((res: TransactionsResponse) => res);
      const multisig = tx.transactionsList.filter(mh => mh.multisignaturetransactionbody.signatureinfo);
      this.total = parseInt(tx.total);
      if (reload) {
        this.multisigHistory = multisig;
      } else {
        this.multisigHistory = this.multisigHistory.concat(multisig);
      }
    } catch (err) {
      this.isError = true;
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }

  onScroll() {
    if (this.multisigHistory && this.multisigHistory.length < this.total) {
      this.page++;
      this.getMultiSigTransaction();
    } else this.finished = true;
  }

  onOpenDetailTransaction(txHash: string, id: string) {
    const hashHex = base64ToHex(txHash);
    this.transactionId = id;
    this.isLoadingDetail = true;
    zoobc.MultiSignature.getPendingByTxHash(hashHex).then((res: MultisigPendingTxDetailResponse) => {
      const list = [];
      list.push(res.pendingtransaction);
      const tx: MultisigPendingTxResponse = {
        count: 1,
        page: 1,
        pendingtransactionsList: list,
      };
      const txFilter = toGetPendingList(tx);
      this.transactionDetail = txFilter.pendingtransactionsList[0];
      this.isLoadingDetail = false;
    });
    this.detailTransactionRefDialog = this.dialog.open(this.detailTransactionDialog, {
      width: '500px',
      maxHeight: '90vh',
    });
  }

  redirect() {
    window.open('https://zoobc.net/transactions/' + this.transactionId, '_blank');
  }
}
