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
  MempoolListParams,
  TransactionType,
  readInt64,
  MultisigPendingTxDetailResponse,
  bufferToBase64,
} from 'zoobc-sdk';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { ContactService } from 'src/app/services/contact.service';
import { base64ToHex } from 'src/helpers/utils';
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

  constructor(public dialog: MatDialog, private authServ: AuthService, private contactServ: ContactService) {}

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
        .then(async (res: MultisigPendingTxResponse) => {
          const tx = toGetPendingList(res);
          this.totalMultiSig = tx.count;
          let pendingList = tx.pendingtransactionsList;
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
      };
      zoobc.Escrows.getList(params)
        .then(async (res: EscrowTransactionsResponse) => {
          this.totalEscrow = parseInt(res.total);
          let txMap = res.escrowsList.map(tx => {
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
    let list: string[] = await zoobc.Mempool.getList(params).then(res => {
      let id: any = res.mempooltransactionsList.filter(tx => {
        const bytes = Buffer.from(tx.transactionbytes.toString(), 'base64');
        if (bytes.readInt32LE(0) == TransactionType.APPROVALESCROWTRANSACTION) return tx;
      });
      id = id.map(tx => {
        const bytes = Buffer.from(tx.transactionbytes.toString(), 'base64');
        const bodyBytes = bytes.slice(165, 177);
        const res = readInt64(bodyBytes, 4);
        return res;
      });
      return id;
    });
    return list;
  }

  async getPendingMultisigApproval() {
    let list: string[] = await zoobc.Mempool.getList().then(res => {
      let txHash: any = res.mempooltransactionsList.filter(tx => {
        const bytes = Buffer.from(tx.transactionbytes.toString(), 'base64');
        if (bytes.readInt32LE(0) == TransactionType.MULTISIGNATURETRANSACTION) return tx;
      });
      txHash = txHash.map(tx => {
        const bytes = Buffer.from(tx.transactionbytes.toString(), 'base64');
        const bodyBytes = bytes.slice(173, 355);
        const txHashBytes = bodyBytes.slice(4, 36);
        const result = bufferToBase64(txHashBytes);
        return result;
      });
      return txHash;
    });
    return list;
  }

  async getSignatureMultisig(txHash) {
    const hashHex = base64ToHex(txHash);
    let visible = await zoobc.MultiSignature.getPendingByTxHash(hashHex).then(
      (res: MultisigPendingTxDetailResponse) => {
        let participants = res.multisignatureinfo.addressesList;
        if (res.pendingsignaturesList) {
          for (let i = 0; i < res.pendingsignaturesList.length; i++) {
            participants = participants.filter(ptp => ptp != res.pendingsignaturesList[i].accountaddress);
          }
          const idx = this.authServ.getAllAccount().filter(acc => participants.includes(acc.address));
          if (idx.length > 0) return true;
          else return false;
        }
      }
    );
    return visible;
  }

  async checkVisibleMultisig(pendingList) {
    let list = [];
    let pendingApprovalList = await this.getPendingMultisigApproval();
    if (pendingApprovalList.length > 0) {
      for (let i = 0; i < pendingList.length; i++) {
        let onPending = pendingApprovalList.includes(pendingList[i].transactionhash);
        if (!onPending) {
          let visible = await this.getSignatureMultisig(pendingList[i].transactionhash);
          if (visible) {
            list.push(pendingList[i]);
          }
        }
      }
    } else {
      for (let i = 0; i < pendingList.length; i++) {
        let visible = await this.getSignatureMultisig(pendingList[i].transactionhash);
        if (visible) {
          list.push(pendingList[i]);
        }
      }
    }
    return list;
  }

  async checkVisibleEscrow(escrowsList) {
    let list = [];
    let pendingApprovalList = await this.getPendingEscrowApproval();
    if (pendingApprovalList.length > 0) {
      for (let i = 0; i < escrowsList.length; i++) {
        let onPending = pendingApprovalList.includes(escrowsList[i].id);
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
}
