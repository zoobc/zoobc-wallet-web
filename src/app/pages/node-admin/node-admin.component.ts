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
  toUnconfirmTransactionNodeWallet,
  MempoolListParams,
  TransactionListParams,
  TransactionsResponse,
  MempoolTransactionsResponse,
  NodeRegistrationsResponse,
  GenerateNodeKeyResponses,
  NodeHardwareResponse,
  TransactionType,
  getZBCAddress,
  Subscription,
  AccountLedgerListParams,
  EventType,
  OrderBy,
} from 'zoobc-sdk';

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

  registeredNode: any;
  pendingNodeTx = null;

  isNodeHardwareLoading: boolean = false;
  isNodeHardwareError: boolean = false;
  isNodeLoading: boolean = false;
  isNodeError: boolean = false;
  isNodeRewardLoading: boolean = false;
  isNodeRewardError: boolean = false;

  lastClaim: string = undefined;
  nodePublicKey: string = '';
  totalNodeReward: number;
  stream: Subscription;

  showAutomaticNumber: boolean = true;
  displayedColumns = [
    {
      id: 'balancechange',
      format: 'money',
      caption: 'reward',
    },
    {
      id: 'blockheight',
      format: 'number',
      caption: 'height',
    },
    {
      id: 'timestamp',
      format: 'timestamp',
      caption: 'timestamp',
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

  getRegisteredNode() {
    this.isNodeLoading = true;
    this.isNodeError = false;
    this.pendingNodeTx = null;
    this.registeredNode = null;

    const params: MempoolListParams = {
      address: this.account.address,
    };
    const param: TransactionListParams = {
      transactionType: TransactionType.CLAIMNODEREGISTRATIONTRANSACTION,
      address: this.account.address,
    };
    zoobc.Transactions.getList(param).then((res: TransactionsResponse) => {
      this.lastClaim = res.transactionsList[0] && res.transactionsList[0].timestamp;
    });
    zoobc.Mempool.getList(params)
      .then((res: MempoolTransactionsResponse) => {
        const pendingTxs = toUnconfirmTransactionNodeWallet(res);
        this.pendingNodeTx = pendingTxs;
        const params: NodeParams = {
          owner: this.account.address,
        };
        return zoobc.Node.get(params);
      })
      .then((res: NodeRegistrationsResponse) => {
        if (res) {
          const { registrationstatus } = res.noderegistration;
          if (registrationstatus == 0) {
            const pubKeyBytes = Buffer.from(String(res.noderegistration.nodepublickey), 'base64');
            const pubKey = getZBCAddress(pubKeyBytes, 'ZNK');
            res.noderegistration.nodepublickey = pubKey;
            this.registeredNode = res.noderegistration;
            this.getTotalScore();
            this.getRewardNode();
          } else if (registrationstatus == 1) {
            if (!this.streamQueue || (this.streamQueue && this.streamQueue.closed))
              this.streamNodeRegistrationQueue();
          }
        }
      })
      .catch(err => {
        console.log(err);
        this.isNodeError = true;
      })
      .finally(() => (this.isNodeLoading = false));
  }

  getTotalScore() {
    zoobc.ParticipationScore.getLatest(this.registeredNode.nodeid)
      .then(res => (this.score = parseInt(res.score) / 1e8))
      .catch(err => console.log(err));
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
            this.nodePublicKey = res.nodepublickey.toString();
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

  async onCopyUrl(url: string) {
    onCopyText(url);

    let message = getTranslation('address copied to clipboard', this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
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
          this.curentLockBalance = Number(curentNode.noderegistration.lockedbalance);
        } else {
          const curentNode = await zoobc.Node.get(params);
          if (curentNode.noderegistration.registrationstatus == 0) {
            this.streamQueue.unsubscribe();
            this.isNodeInQueue = false;
            this.getRegisteredNode();
          }
        }
      },
      err => {}
    );
  }

  async getRewardNode() {
    this.tableData = [];
    if (!this.registeredNode) return null;
    this.isNodeRewardLoading = true;
    this.isNodeRewardError = false;
    this.totalNodeReward = 0;
    let param: AccountLedgerListParams = {
      accountAddress: this.account.address,
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
      this.totalNodeReward = parseInt(accLedger.total);
      this.tableData = accLedger.accountledgersList;
    } catch (err) {
      this.isNodeRewardError = true;
      console.log(err);
    } finally {
      this.isNodeRewardLoading = false;
    }
  }
  getMoreReward() {
    const dialog = this.dialog.open(NodeRewardListComponent, {
      width: '600px',
      maxHeight: '90vh',
    });
  }
  getMyNodePublicKey() {
    zoobc.Node.getMyNodePublicKey(this.account.nodeIP).then(res => {
      this.nodePublicKey = getZBCAddress(Buffer.from(res.nodepublickey.toString(), 'base64'), 'ZNK');
    });
  }
}
