// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

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

//     2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
// contact us at roberto.capodieci[at]blockchainzoo.com
// and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor() {}

  // async getTx(reload: boolean = false) {
  //   if (!this.isLoading) {
  //     // 72 is transaction item's height
  //     const perPage = Math.ceil(window.outerHeight / 72);

  //     if (reload) {
  //       this.accountHistory = null;
  //       this.page = 1;
  //     }

  //     this.isLoading = true;
  //     this.isError = false;

  //     const txParam: TransactionListParams = {
  //       address: this.address,
  //       transactionType: this.txType,
  //       pagination: {
  //         page: this.page,
  //         limit: perPage,
  //       },
  //     };

  //     try {
  //       let trxList = await zoobc.Transactions.getList(txParam);

  //       let lastHeight = 0;
  //       let firstHeight = 0;
  //       if (trxList.transactions.length > 0) {
  //         lastHeight = trxList.transactions[0].height;
  //         firstHeight = trxList.transactions[trxList.transactions.length - 1].height;
  //       }

  //       const multisigTx = trxList.transactions.filter(trx => trx.multisig == true).map(trx => trx.id);

  //       const paramEscrow: EscrowListParams = {
  //         blockHeightStart: firstHeight,
  //         blockHeightEnd: lastHeight,
  //         recipient: this.address,
  //         statusList: [0, 1, 2, 3],
  //         latest: false,
  //         pagination: {
  //           orderBy: OrderBy.DESC,
  //           orderField: 'block_height',
  //         },
  //       };
  //       this.startMatch = 0;
  //       const escrowTx = await zoobc.Escrows.getList(paramEscrow);

  //       const escrowList = escrowTx.escrowList;
  //       const escrowGroup = this.groupEscrowList(escrowList);

  //       let txs = trxList.transactions;
  //       txs.map(recent => {
  //         let escStatus = this.matchEscrowGroup(recent.height, escrowGroup);
  //         recent.senderAlias = this.contactServ.get(recent.sender.value).name || '';
  //         recent.recipientAlias = this.contactServ.get(recent.recipient.value).name || '';
  //         const nodeManagementTxType =
  //           this.txType == 2 || this.txType == 258 || this.txType == 514 || this.txType == 770;
  //         if (nodeManagementTxType) {
  //           const hasNodePublicKey = recent.txBody.nodepublickey;
  //           const hasAccountAddress = recent.txBody.accountaddress;
  //           if (hasNodePublicKey) {
  //             const buffer = Buffer.from(recent.txBody.nodepublickey.toString(), 'base64');
  //             const pubkey = getZBCAddress(buffer, 'ZNK');
  //             recent['txBody'].nodepublickey = pubkey;
  //           }
  //           if (hasAccountAddress) {
  //             const accountAddress = parseAddress(recent.txBody.accountaddress);
  //             recent['txBody'].accountaddress = accountAddress.value;
  //           }
  //         }
  //         if (escStatus) {
  //           recent.escrow = true;
  //           recent['txBody'].approval = escStatus.status;
  //         } else recent.escrow = false;
  //         recent.multisig = multisigTx.includes(recent.id);
  //         return recent;
  //       });
  //       this.total = trxList.total;
  //       this.accountHistory = reload ? txs : this.accountHistory.concat(txs);

  //       if (reload) {
  //         const mempoolParams: MempoolListParams = { address: this.address };
  //         this.unconfirmTx = await zoobc.Mempool.getList(mempoolParams).then((res: ZBCTransactions) =>
  //           res.transactions.map(uc => {
  //             this.txType = uc.transactionType;
  //             return uc;
  //           })
  //         );
  //       }
  //     } catch {
  //       this.isError = true;
  //       this.unconfirmTx = null;
  //     } finally {
  //       this.isLoading = false;
  //       this.lastRefresh = Date.now();
  //     }
  //   }
  // }

  // groupEscrowList(escrowList: any[]) {
  //   const escrowCopy = escrowList.map(x => Object.assign({}, x));
  //   let escrowGroup = [];
  //   for (let i = 0; i < escrowCopy.length; i++) {
  //     let idx = escrowGroup.findIndex(eg => eg.id == escrowCopy[i].id);
  //     if (idx < 0) escrowGroup.push(escrowCopy[i]);
  //     else {
  //       if (escrowGroup[idx].blockheight > escrowCopy[i].blockheight)
  //         escrowGroup[idx]['blockheight'] = escrowCopy[i].blockheight;
  //     }
  //   }
  //   escrowGroup.sort(function(a, b) {
  //     return b.blockheight - a.blockheight;
  //   });
  //   return escrowGroup;
  // }
  // matchEscrowGroup(blockheight, escrowList: any[]) {
  //   let escrowObj: any;
  //   for (let i = this.startMatch; i < escrowList.length; i++) {
  //     if (escrowList[i].blockheight == blockheight) {
  //       escrowObj = Object.assign({}, escrowList[i]);
  //       this.startMatch = i;
  //     }
  //   }
  //   return escrowObj;
  // }
}
