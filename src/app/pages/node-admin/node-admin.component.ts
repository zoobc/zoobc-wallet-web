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
  getZBCAdress,
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
    this.getRegisteredNode();
    this.streamNodeHardwareInfo();
    this.getRewardNode();
  }

  ngOnDestroy() {
    if (this.stream) this.stream.unsubscribe();
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
            const pubKey = getZBCAdress(pubKeyBytes, 'ZNK');
            res.noderegistration.nodepublickey = pubKey;

            this.registeredNode = res.noderegistration;
          }
        }
      })
      .catch(err => {
        console.log(err);
        this.isNodeError = true;
      })
      .finally(() => (this.isNodeLoading = false));
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
    });

    dialog.afterClosed().subscribe(success => {
      if (success) this.getRegisteredNode();
    });
  }

  openUpdateNode() {
    const dialog = this.dialog.open(UpdateNodeComponent, {
      width: '420px',
      maxHeight: '90vh',
      data: this.registeredNode,
    });

    dialog.afterClosed().subscribe(success => {
      if (success) this.getRegisteredNode();
    });
  }

  openClaimNode() {
    const dialog = this.dialog.open(ClaimNodeComponent, {
      width: '420px',
      maxHeight: '90vh',
      data: this.registeredNode,
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

  async getRewardNode() {
    this.tableData = [];
    this.isNodeRewardLoading = true;
    this.isNodeRewardError = false;
    this.totalNodeReward = 0;
    let param: AccountLedgerListParams = {
      accountAddress: this.account.address,
      eventType: EventType.EVENTREWARD,
      pagination: {
        page: 1,
        limit: 5,
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
}
