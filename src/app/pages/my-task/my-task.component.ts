// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, HostListener, OnInit } from '@angular/core';
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
} from 'zbc-sdk';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { ZBCTransaction } from 'zbc-sdk';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.scss'],
})
export class MyTaskComponent implements OnInit {
  // Escrow Input
  isLoadingEscrow: boolean = false;
  isErrorEscrow: boolean = false;
  // Multisignature input
  isLoadingMultisig: boolean = false;
  isErrorMultiSig: boolean = false;

  account: SavedAccount;

  blockHeight: number;
  isLoadingBlockHeight: boolean = false;

  escrowTransactions: Escrow[];
  pageEscrow: number = 1;
  perPageEscrow: number = 10;
  totalEscrow: number = 0;
  escrowfinished: boolean = false;

  multiSigPendingList: ZBCTransaction[];
  pageMultiSig: number = 1;
  perPageMultiSig: number = 10;
  totalMultiSig: number = 0;
  multiSigfinished: boolean = false;
  showProcessFormEscrow: boolean = false;
  escrowDetail: Escrow;
  txHash: string;
  showProcessFormMultisig: boolean = false;

  largeScreen = window.innerWidth >= 576 ? true : false;

  constructor(public dialog: MatDialog, private authServ: AuthService) {}

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    this.getEscrowTx(true);
    this.getMultiSigPendingList(true);
    this.getBlockHeight();
  }

  @HostListener('window:resize', ['$event']) onResize(event) {
    this.largeScreen = event.target.innerWidth >= 576 ? true : false;
  }

  onReload() {
    this.getEscrowTx(true);
    this.getMultiSigPendingList(true);
    this.getBlockHeight();
  }

  getMultiSigPendingList(reload: boolean = false) {
    if (!this.isLoadingMultisig) {
      this.isLoadingMultisig = true;
      this.isErrorMultiSig = false;
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
          // if (pendingList.length > 0) pendingList = await this.checkVisibleMultisig(pendingList);
          if (reload) this.multiSigPendingList = pendingList;
          else this.multiSigPendingList = this.multiSigPendingList.concat(pendingList);
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
      this.isErrorEscrow = false;
      const perPage = Math.ceil(window.outerHeight / 124);

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
          // if (txMap.length > 0) txMap = await this.checkVisibleEscrow(txMap);
          if (reload) this.escrowTransactions = txMap;
          else this.escrowTransactions = this.escrowTransactions.concat(txMap);
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

  dismiss() {
    this.escrowDetail = undefined;
    this.txHash = undefined;
  }

  getDetailEscrow(escrow: Escrow) {
    this.escrowDetail = escrow;
    this.txHash = undefined;
  }

  getTxHash(txHash: string) {
    this.txHash = txHash;
    this.escrowDetail = undefined;
  }
}
