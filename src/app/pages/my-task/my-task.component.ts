import { Component, OnInit, Input, ViewEncapsulation, Inject, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material';
import zoobc, {
  EscrowListParams,
  MultisigPendingListParams,
  OrderBy,
  HostInfoResponse,
  EscrowStatus,
  PendingTransactionStatus,
  MempoolListParams,
  TransactionType,
  Escrows,
  ZBCTransactions,
  Escrow,
} from 'zoobc-sdk';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { DOCUMENT } from '@angular/common';
import { EscrowTransactionComponent } from './escrow-transaction/escrow-transaction.component';
import { ZBCTransaction } from 'zoobc-sdk';
import { MultisigTransactionComponent } from './multisig-transaction/multisig-transaction.component';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyTaskComponent implements OnInit {
  // Escrow Input
  @Input() isLoadingEscrow: boolean = false;
  @Input() isErrorEscrow: boolean = false;
  isLoadingBlockHeight: boolean = false;
  // Multisignature input
  @Input() isLoadingMultisig: boolean = false;
  @Input() isErrorMultiSig: boolean = false;

  @ViewChild(EscrowTransactionComponent)
  private escrowComponent: EscrowTransactionComponent;

  @ViewChild(MultisigTransactionComponent)
  private multisigComponent: MultisigTransactionComponent;

  @ViewChildren('checkboxEscrow') private checkboxEscrow: any;
  @ViewChildren('checkboxMultisig') private checkboxMultisig: any;

  account: SavedAccount;
  timeout: number;

  escrowTransactions;
  blockHeight: number;
  pageEscrow: number = 1;
  perPageEscrow: number = 10;
  totalEscrow: number = 0;
  escrowfinished: boolean = false;

  multiSigPendingList;
  pageMultiSig: number = 1;
  perPageMultiSig: number = 10;
  totalMultiSig: number = 0;
  multiSigfinished: boolean = false;
  showProcessFormEscrow: boolean = false;
  escrowDetail: Escrow;
  multisigDetail: ZBCTransaction;
  showProcessFormMultisig: boolean = false;

  constructor(public dialog: MatDialog, private authServ: AuthService, @Inject(DOCUMENT) private document) {}

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    this.getEscrowTx(true);
    this.getMultiSigPendingList(true);
    this.getBlockHeight();
  }

  getMultiSigPendingList(reload: boolean = false) {
    if (!this.isLoadingMultisig) {
      this.isLoadingMultisig = true;
      const perPage = Math.ceil(window.outerHeight / 72);

      if (reload) {
        this.multiSigPendingList = null;
        this.pageMultiSig = 1;
      }
      const params: MultisigPendingListParams = {
        address: this.account.address,
        status: PendingTransactionStatus.PENDINGTRANSACTIONPENDING,
        pagination: {
          page: this.pageMultiSig,
          limit: perPage,
        },
      };
      zoobc.MultiSignature.getPendingList(params)
        .then(async (tx: ZBCTransactions) => {
          this.totalMultiSig = tx.total;
          let pendingList = tx.transactions;
          if (pendingList.length > 0) pendingList = await this.checkVisibleMultisig(pendingList);
          if (reload) {
            this.multiSigPendingList = pendingList;
          } else {
            this.multiSigPendingList = this.multiSigPendingList.concat(pendingList);
          }
        })
        .catch(err => {
          this.isErrorMultiSig = true;
          console.log(err);
        })
        .finally(() => (this.isLoadingMultisig = false));
    }
  }

  getEscrowTx(reload: boolean = false) {
    if (!this.isLoadingEscrow) {
      this.isLoadingEscrow = true;
      const perPage = Math.ceil(window.outerHeight / 72);

      if (reload) {
        this.escrowTransactions = null;
        this.pageEscrow = 1;
      }

      const params: EscrowListParams = {
        approverAddress: this.account.address,
        statusList: [EscrowStatus.PENDING],
        pagination: {
          page: this.pageEscrow,
          limit: perPage,
          orderBy: OrderBy.DESC,
          orderField: 'timeout',
        },
        latest: true,
      };
      zoobc.Escrows.getList(params)
        .then(async (res: Escrows) => {
          this.totalEscrow = res.total;
          let txMap = res.escrowList;
          if (txMap.length > 0) txMap = await this.checkVisibleEscrow(txMap);
          if (reload) {
            this.escrowTransactions = txMap;
          } else {
            this.escrowTransactions = this.escrowTransactions.concat(txMap);
          }
        })
        .catch(err => {
          this.isErrorEscrow = true;
          console.log(err);
        })
        .finally(() => (this.isLoadingEscrow = false));
    }
  }

  async getPendingEscrowApproval() {
    const params: MempoolListParams = {
      address: this.account.address,
    };
    let list = await zoobc.Mempool.getList(params).then(res => {
      let id = res.transactions.filter(tx => {
        if (tx.transactionType == TransactionType.APPROVALESCROWTRANSACTION) return tx;
      });
      id = id.map(idx => {
        return idx.txBody.transactionid;
      });
      return {
        total: id.length,
        transactions: id,
      };
    });
    return list;
  }

  async getPendingMultisigApproval() {
    const paramPool: MempoolListParams = {
      address: this.account.address,
    };
    let list = await zoobc.Mempool.getList(paramPool).then(res => {
      return res;
    });
    return list;
  }

  async checkVisibleMultisig(pendingList) {
    let list = [];
    let pendingApprovalList = await this.getPendingMultisigApproval();
    if (pendingApprovalList.total > 0) {
      for (let i = 0; i < pendingList.length; i++) {
        let onPending = pendingApprovalList.transactions.includes(pendingList[i].transactionHash);
        if (!onPending) {
          list.push(pendingList[i]);
        }
      }
      return list;
    } else {
      return pendingList;
    }
  }

  async checkVisibleEscrow(escrowsList) {
    let list = [];
    let pendingApprovalList = await this.getPendingEscrowApproval();
    if (pendingApprovalList.total > 0) {
      for (let i = 0; i < escrowsList.length; i++) {
        let onPending = pendingApprovalList.transactions.includes(escrowsList[i].id);
        if (!onPending) {
          list.push(escrowsList[i]);
        }
      }
      return list;
    } else {
      return escrowsList;
    }
  }

  reload(load: boolean = false) {
    this.getEscrowTx(load);
    this.getMultiSigPendingList(load);
    this.getBlockHeight();
  }

  getBlockHeight() {
    this.isLoadingBlockHeight = true;
    zoobc.Host.getInfo()
      .then((res: HostInfoResponse) => {
        res.chainstatusesList.filter(chain => {
          if (chain.chaintype === 0) this.blockHeight = chain.height;
        });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => (this.isLoadingBlockHeight = false));
  }

  onScrollEscrow() {
    if (this.escrowTransactions && this.escrowTransactions.length < this.totalEscrow) {
      this.pageEscrow++;
      this.getEscrowTx();
    } else this.escrowfinished = true;
  }

  onScrollMultiSig() {
    if (this.multiSigPendingList && this.multiSigPendingList.length < this.totalMultiSig) {
      this.pageMultiSig++;
      this.getMultiSigPendingList();
    } else this.multiSigfinished = true;
  }

  toogleShowProcessFormEscrow() {
    this.showProcessFormEscrow = !this.showProcessFormEscrow;
    if (this.showProcessFormEscrow == true) {
      this.updateStyle();
    }
  }

  toogleShowSignFormMultisig() {
    this.showProcessFormMultisig = !this.showProcessFormMultisig;
    if (this.showProcessFormMultisig == true) {
      this.updateStyle();
    }
  }

  updateStyle() {
    let widthWindows = window.outerWidth;
    if (widthWindows > 767) {
      this.document.getElementById('my-task').style.width = '53%';
      this.document.getElementById('dtl-task').style.width = '44%';
    } else {
      this.document.getElementById('my-task').style.width = '90%';
      this.document.getElementById('dtl-task').style.width = '402px';
    }
  }

  dismiss(e: boolean) {
    if (e == true) {
      this.document.getElementById('dtl-task').style.display = 'none';
      this.showProcessFormEscrow = false;
      this.showProcessFormMultisig = false;
      if (this.checkboxEscrow._results.length > 0) this.checkboxEscrow._results[0].checked = false;
      else if (this.checkboxMultisig._results.length > 0) this.checkboxMultisig._results[0].checked = false;
    }
  }

  getDetailEscrow($event) {
    this.escrowDetail = $event;
    let widthWindows = window.outerWidth;
    setTimeout(() => {
      this.document.getElementById('dtl-task').style.display = 'block';
      if (widthWindows < 500) this.document.getElementById('dtl-task').style.width = '402px';
    }, 30);
  }

  getDetailMultisig($event) {
    this.multisigDetail = $event;
    let widthWindows = window.outerWidth;
    setTimeout(() => {
      this.document.getElementById('dtl-task').style.display = 'block';
      if (widthWindows < 500) this.document.getElementById('dtl-task').style.width = '402px';
    }, 30);
  }
}
