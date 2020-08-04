import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import zoobc, {
  EscrowListParams,
  MultisigPendingListParams,
  MultisigPendingTxResponse,
  toGetPendingList,
  EscrowTransactionsResponse,
  OrderBy,
  HostInfoResponse,
  EscrowStatus,
  PendingTransactionStatus,
} from 'zoobc-sdk';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { ContactService } from 'src/app/services/contact.service';
import { Router } from '@angular/router';

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

  constructor(
    public dialog: MatDialog,
    private authServ: AuthService,
    private contactServ: ContactService,
    private router: Router
  ) {}

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
        .then((res: MultisigPendingTxResponse) => {
          const tx = toGetPendingList(res);
          this.totalMultiSig = tx.count;
          const pendingList = tx.pendingtransactionsList;
          pendingList.map(res => {
            res['alias'] = this.contactServ.get(res.senderaddress).name || '';
          });
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
      };
      zoobc.Escrows.getList(params)
        .then((res: EscrowTransactionsResponse) => {
          this.totalEscrow = parseInt(res.total);
          let txFilter = res.escrowsList.filter(tx => {
            if (tx.latest == true) return tx;
          });
          let txMap = txFilter.map(tx => {
            const alias = this.contactServ.get(tx.recipientaddress).name || '';
            return {
              id: tx.id,
              alias: alias,
              senderaddress: tx.senderaddress,
              recipientaddress: tx.recipientaddress,
              approveraddress: tx.approveraddress,
              amount: tx.amount,
              commission: tx.commission,
              timeout: parseInt(tx.timeout),
              status: tx.status,
              blockheight: tx.blockheight,
              latest: tx.latest,
              instruction: tx.instruction,
            };
          });
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
}
