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
  pendingIdEscrow: string;
  txHash: any;
  txHashSignature: any;
  visible: boolean = false;

  constructor(public dialog: MatDialog, private authServ: AuthService, private contactServ: ContactService) {}

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    this.getEscrowTx(true);
    this.getMultiSigPendingList(true);
    this.getBlockHeight();
  }

  getMultiSigPendingList(reload: boolean = false) {
    if (!this.isLoadingMultisig) {
      this.getPendingMultisigTx();
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
          pendingList = await this.checkVisibleMultisig(pendingList);
          if (this.txHash) pendingList = pendingList.filter(res => res.transactionhash != this.txHash);
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
      this.getPendingEscrowTx();
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
          txMap = txMap.filter(tx => {
            if (tx.id !== this.pendingIdEscrow) return tx;
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

  getPendingEscrowTx() {
    const params: MempoolListParams = {
      address: this.account.address,
    };
    zoobc.Mempool.getList(params).then(res => {
      let id: any = res.mempooltransactionsList.filter(tx => {
        const bytes = Buffer.from(tx.transactionbytes.toString(), 'base64');
        if (bytes.readInt32LE(0) == TransactionType.APPROVALESCROWTRANSACTION) return tx;
      });
      id = id.map(tx => {
        const bytes = Buffer.from(tx.transactionbytes.toString(), 'base64');
        const bodyBytes = bytes.slice(165, 177);
        const res = readInt64(bodyBytes, 4);
        this.pendingIdEscrow = res;
        return res;
      });
    });
  }

  getPendingMultisigTx() {
    const params: MempoolListParams = {
      address: this.account.signByAddress,
    };
    zoobc.Mempool.getList(params).then(res => {
      let id: any = res.mempooltransactionsList.filter(tx => {
        const bytes = Buffer.from(tx.transactionbytes.toString(), 'base64');
        if (bytes.readInt32LE(0) == TransactionType.MULTISIGNATURETRANSACTION) return tx;
      });
      id = id.map(tx => {
        const bytes = Buffer.from(tx.transactionbytes.toString(), 'base64');
        const bodyBytes = bytes.slice(173, 355);
        const txHashBytes = bodyBytes.slice(4, 36);
        this.txHash = bufferToBase64(txHashBytes);
        return this.txHash;
      });
    });
  }

  async getSignatureMultisig(txHash) {
    const hashHex = base64ToHex(txHash);
    await zoobc.MultiSignature.getPendingByTxHash(hashHex).then((res: MultisigPendingTxDetailResponse) => {
      const list = [];
      list.push(res.pendingtransaction);
      const tx: MultisigPendingTxResponse = {
        count: 1,
        page: 1,
        pendingtransactionsList: list,
      };
      let pendingSignatures = res.pendingsignaturesList;
      let idx = pendingSignatures.findIndex(
        sign => sign.accountaddress == this.authServ.getCurrAccount().signByAddress
      );
      if (idx >= 0) {
        this.visible = false;
        this.txHashSignature = txHash;
      } else {
        this.visible = true;
        this.txHashSignature = '';
      }
    });
  }

  async checkVisibleMultisig(pendingList) {
    let list = [];
    for (let i = 0; i <= this.totalMultiSig; i++) {
      if (pendingList[i] != undefined) {
        await this.getSignatureMultisig(pendingList[i].transactionhash);
        if (this.visible) {
          list.push(pendingList[i]);
        }
      }
    }
    return list;
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
