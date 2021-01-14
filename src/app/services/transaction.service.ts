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
