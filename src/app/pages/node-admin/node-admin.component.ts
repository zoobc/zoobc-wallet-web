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

import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { RegisterNodeComponent } from './register-node/register-node.component';
import { UpdateNodeComponent } from './update-node/update-node.component';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { ClaimNodeComponent } from './claim-node/claim-node.component';
import Swal from 'sweetalert2';
import { RemoveNodeComponent } from './remove-node/remove-node.component';
import { NodeRewardListComponent } from '../../components/node-reward-list/node-reward-list.component';
import { onCopyText, getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import zoobc, {
  NodeParams,
  MempoolListParams,
  TransactionListParams,
  GenerateNodeKeyResponses,
  NodeHardwareResponse,
  TransactionType,
  getZBCAddress,
  Subscription,
  AccountLedgerListParams,
  EventType,
  OrderBy,
  ZBCTransactions,
  NodeRegistration,
  ZBCTransaction,
} from 'zbc-sdk';

@Component({
  selector: 'app-node-admin',
  templateUrl: './node-admin.component.html',
  styleUrls: ['./node-admin.component.scss'],
})
export class NodeAdminComponent implements OnInit, OnDestroy {
  account: SavedAccount;
  hwInfo: any;
  mbToB = Math.pow(1024, 2);
  gbToB = Math.pow(1024, 3);

  registeredNode: NodeRegistration;
  registrationType: string;

  isNodeHardwareLoading: boolean = false;
  isNodeHardwareError: boolean = false;
  isNodeLoading: boolean = false;
  isNodeError: boolean = false;
  isNodeRewardLoading: boolean = false;
  isNodeRewardError: boolean = false;

  lastClaim: number; // timestamp
  nodePublicKey: string = '';
  totalNodeReward: number;
  stream: Subscription;

  showAutomaticNumber: boolean = true;
  displayedColumns = [
    {
      id: 'balanceChange',
      format: 'money',
      caption: 'reward',
      width: 40,
    },
    {
      id: 'blockHeight',
      format: 'number',
      caption: 'height',
      width: 15,
    },
    {
      id: 'timestamp',
      format: 'timestamp',
      caption: 'timestamp',
      width: 30,
      align: 'right',
    },
  ];

  tableData = [];
  score: number;

  isNodeInQueue: boolean = false;
  streamQueue: Subscription;
  queueLockBalance: number;
  curentLockBalance: number;
  curentNodeQueue: any;

  @ViewChild('popupPubKey') popupPubKey: TemplateRef<any>;
  successRefDialog: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    private authServ: AuthService,
    private snackbar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.account = authServ.getCurrAccount();
  }

  ngOnInit() {
    this.getMyNodePublicKey();
    this.getRegisteredNode();
    this.streamNodeHardwareInfo();
    this.getRewardNode();
  }

  ngOnDestroy() {
    if (this.stream) this.stream.unsubscribe();
    if (this.streamQueue) this.streamQueue.unsubscribe();
  }

  async getRegisteredNode() {
    this.isNodeLoading = true;
    this.isNodeError = false;
    this.registrationType = '';
    this.registeredNode = null;

    const txParam: TransactionListParams = {
      transactionType: TransactionType.CLAIMNODEREGISTRATIONTRANSACTION,
      address: this.account.address,
    };
    zoobc.Transactions.getList(txParam).then((res: ZBCTransactions) => {
      this.lastClaim = res.transactions[0] && res.transactions[0].timestamp;
    });

    try {
      const mempoolParam: MempoolListParams = {
        address: this.account.address,
      };
      await zoobc.Mempool.getList(mempoolParam).then((res: ZBCTransactions) => {
        this.registrationType = this.getRegistrationType(res.transactions);
      });

      const params: NodeParams = {
        owner: this.account.address,
      };
      await zoobc.Node.get(params).then((res: NodeRegistration) => {
        if (res) {
          const registrationstatus = res.registrationStatus;
          if (registrationstatus == 0) {
            this.registeredNode = res;
            this.getTotalScore();
            this.getRewardNode();
          } else if (registrationstatus == 1) {
            if (!this.streamQueue || (this.streamQueue && this.streamQueue.closed))
              this.streamNodeRegistrationQueue();
          }
        }
      });
    } catch (err) {
      console.log(err);
      this.isNodeError = true;
    } finally {
      this.isNodeLoading = false;
    }
  }

  generateNewPubKey() {
    // todo: create loader and display the result
    let title = getTranslation('are you sure want to generate new node public key?', this.translate);
    let text = getTranslation(
      'you need to update your node registration or your node will stop smithing',
      this.translate
    );
    Swal.fire({
      title: title,
      text: text,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return zoobc.Node.generateNodeKey(this.account.nodeIP, this.authServ.seed)
          .then((res: GenerateNodeKeyResponses) => {
            const nodeBuffer = Buffer.from(res.nodepublickey.toString(), 'base64');
            this.nodePublicKey = getZBCAddress(nodeBuffer, 'ZNK');
            this.successRefDialog = this.dialog.open(this.popupPubKey, {
              disableClose: true,
              width: '500px',
              maxHeight: '90vh',
            });
          })
          .catch(err => {
            Swal.fire('Error', err, 'error');
          });
      },
    });
  }

  streamNodeHardwareInfo() {
    this.isNodeHardwareLoading = true;
    this.isNodeHardwareError = false;
    this.stream = zoobc.Node.getHardwareInfo(this.account.nodeIP, this.authServ.seed).subscribe(
      (res: NodeHardwareResponse) => {
        this.isNodeHardwareLoading = false;
        this.hwInfo = res.nodehardware;
      },
      err => {
        console.log(err);
        this.isNodeHardwareLoading = false;
        this.isNodeHardwareError = true;
      }
    );
  }

  streamNodeRegistrationQueue() {
    this.isNodeInQueue = true;
    const params: NodeParams = {
      owner: this.account.address,
    };
    this.streamQueue = zoobc.Node.getPending(1, this.authServ.seed).subscribe(
      async res => {
        if (res.noderegistrationsList.length > 0) {
          const { lockedbalance } = res.noderegistrationsList[0];
          this.queueLockBalance = Number(lockedbalance);
          const curentNode = await zoobc.Node.get(params);
          this.curentNodeQueue = curentNode;
          this.curentLockBalance = Number(curentNode.lockedBalance);
        } else {
          const curentNode = await zoobc.Node.get(params);
          if (curentNode.registrationStatus == 0) {
            this.streamQueue.unsubscribe();
            this.isNodeInQueue = false;
            this.getRegisteredNode();
          }
        }
      },
      err => {}
    );
  }

  getMyNodePublicKey() {
    zoobc.Node.getMyNodePublicKey(this.account.nodeIP).then(res => {
      this.nodePublicKey = getZBCAddress(Buffer.from(res.nodepublickey.toString(), 'base64'), 'ZNK');
    });
  }

  getRegistrationType(txs: ZBCTransaction[]): string {
    for (let i = 0; i < txs.length; i++) {
      switch (txs[i].transactionType) {
        case TransactionType.NODEREGISTRATIONTRANSACTION:
          return 'register node';
        case TransactionType.UPDATENODEREGISTRATIONTRANSACTION:
          return 'update node';
        case TransactionType.CLAIMNODEREGISTRATIONTRANSACTION:
          return 'claim node';
        case TransactionType.REMOVENODEREGISTRATIONTRANSACTION:
          return 'remove node';
      }
    }
  }

  // ========================== PARTICIPATION AND REWARD ================== //
  getTotalScore() {
    zoobc.ParticipationScore.getLatest(this.registeredNode.nodeId)
      .then(res => (this.score = parseInt(res.score) / 1e8))
      .catch(err => console.log(err));
  }

  async getRewardNode() {
    this.tableData = [];
    if (!this.registeredNode) return null;
    this.isNodeRewardLoading = true;
    this.isNodeRewardError = false;
    this.totalNodeReward = 0;
    let param: AccountLedgerListParams = {
      address: this.account.address,
      eventType: EventType.EVENTREWARD,
      pagination: {
        page: 1,
        limit: 5,
        orderField: 'timestamp',
        orderBy: OrderBy.DESC,
      },
    };
    try {
      const accLedger = await zoobc.AccountLedger.getList(param);
      this.totalNodeReward = accLedger.total;
      this.tableData = accLedger.accountLedgerList;
    } catch (err) {
      this.isNodeRewardError = true;
      console.log(err);
    } finally {
      this.isNodeRewardLoading = false;
    }
  }

  getMoreReward() {
    this.dialog.open(NodeRewardListComponent, {
      width: '600px',
      maxHeight: '90vh',
    });
  }
  // ========================== END PARTICIPATION AND REWARD ================== //

  async onCopyUrl(url: string) {
    onCopyText(url);

    let message = getTranslation('address copied to clipboard', this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
  }

  // ======================== OPEN DIALOG NODE ======================== //
  openRegisterNode() {
    const dialog = this.dialog.open(RegisterNodeComponent, {
      width: '420px',
      maxHeight: '90vh',
      data: this.nodePublicKey,
    });

    dialog.afterClosed().subscribe(success => {
      if (success) {
        this.getRegisteredNode();
        if (!this.streamNodeRegistrationQueue) {
          this.streamNodeRegistrationQueue();
        }
      }
    });
  }

  openUpdateNode() {
    const dialog = this.dialog.open(UpdateNodeComponent, {
      width: '420px',
      maxHeight: '90vh',
      data: this.registeredNode ? this.registeredNode : this.curentNodeQueue,
    });
    dialog.afterClosed().subscribe(success => {
      if (success) this.getRegisteredNode();
    });
  }

  openClaimNode() {
    const dialog = this.dialog.open(ClaimNodeComponent, {
      width: '420px',
      maxHeight: '90vh',
      data: this.nodePublicKey,
    });

    dialog.afterClosed().subscribe(success => {
      if (success) this.getRegisteredNode();
    });
  }

  openRemoveNode() {
    const dialog = this.dialog.open(RemoveNodeComponent, {
      width: '420px',
      maxHeight: '90vh',
      data: this.registeredNode,
    });

    dialog.afterClosed().subscribe(success => {
      if (success) this.getRegisteredNode();
    });
  }

  onCloseDialog() {
    this.successRefDialog.close();
  }
  // ======================== END OPEN DIALOG NODE ======================== //
}
