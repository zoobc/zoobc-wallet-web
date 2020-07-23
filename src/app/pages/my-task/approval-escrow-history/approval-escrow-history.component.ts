import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import zoobc, { TransactionListParams, TransactionType, EscrowTransactionResponse } from 'zoobc-sdk';
import { AuthService } from 'src/app/services/auth.service';
import { ContactService } from 'src/app/services/contact.service';
import { Buffer } from 'buffer';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-approval-escrow-history',
  templateUrl: './approval-escrow-history.component.html',
  styleUrls: ['./approval-escrow-history.component.scss'],
})
export class ApprovalEscrowHistoryComponent implements OnInit {
  escrowApprovalList: any[];
  address: string = this.authServ.getCurrAccount().address;
  page: number = 1;
  perPage: number = 10;
  total: number = 0;
  finished: boolean = false;
  isLoading: boolean = false;
  isError: boolean = false;
  @ViewChild('detailEscrow') detailEscrow: TemplateRef<any>;
  escrowDetail: EscrowTransactionResponse;
  isLoadingDetail: boolean;
  lastRefresh: number;

  constructor(
    private authServ: AuthService,
    private contactServ: ContactService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getApprovalList(true);
  }

  async getApprovalList(reload: boolean = false) {
    if (!this.isLoading) {
      const perPage = Math.ceil(window.outerHeight / 72);

      if (reload) {
        this.escrowApprovalList = null;
        this.page = 1;
      }

      this.isLoading = true;
      this.isError = false;
      const param: TransactionListParams = {
        address: this.address,
        transactionType: TransactionType.APPROVALESCROWTRANSACTION,
        pagination: {
          page: this.page,
          limit: perPage,
        },
      };
      zoobc.Transactions.getList(param)
        .then(res => {
          this.total = parseInt(res.total);
          let txMap = res.transactionsList.map(tx => {
            let approvalStatus = tx.approvalescrowtransactionbody.approval === 0 ? 'Approved' : 'Rejected';
            const alias = this.contactServ.get(tx.senderaccountaddress).alias || '';
            return {
              id: tx.approvalescrowtransactionbody.transactionid,
              alias: alias,
              sender: tx.senderaccountaddress,
              approvalStatus: approvalStatus,
              timestamp: parseInt(tx.timestamp) * 1000,
            };
          });
          this.escrowApprovalList = reload ? txMap : this.escrowApprovalList.concat(txMap);
        })
        .catch(err => {
          this.isError = true;
          console.log(err);
        })
        .finally(() => ((this.isLoading = false), (this.lastRefresh = Date.now())));
    }
  }

  reload(load: boolean = false) {
    this.getApprovalList(load);
  }

  onScroll() {
    if (this.escrowApprovalList && this.escrowApprovalList.length < this.total) {
      this.page++;
      this.getApprovalList();
    } else this.finished = true;
  }

  openDetail(id) {
    this.isLoadingDetail = true;
    zoobc.Escrows.get(id).then((res: EscrowTransactionResponse) => {
      this.escrowDetail = res;
      this.isLoadingDetail = false;
    });
    this.dialog.open(this.detailEscrow, {
      width: '500px',
      maxHeight: '90vh',
    });
  }
}
