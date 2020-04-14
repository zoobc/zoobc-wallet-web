import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RegisterNodeComponent } from './register-node/register-node.component';
import { UpdateNodeComponent } from './update-node/update-node.component';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { ClaimNodeComponent } from './claim-node/claim-node.component';
import Swal from 'sweetalert2';
import { RemoveNodeComponent } from './remove-node/remove-node.component';
import zoobc, {
  NodeParams,
  toUnconfirmTransactionNodeWallet,
  MempoolListParams,
  TransactionListParams,
} from 'zoobc-sdk';

@Component({
  selector: 'app-node-admin',
  templateUrl: './node-admin.component.html',
  styleUrls: ['./node-admin.component.scss'],
})
export class NodeAdminComponent implements OnInit {
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

  lastClaim: string = undefined;

  constructor(private dialog: MatDialog, private authServ: AuthService) {
    this.account = authServ.getCurrAccount();
  }

  ngOnInit() {
    this.getRegisteredNode();
    this.streamNodeHardwareInfo();
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
      transactionType: 770,
      address: this.account.address,
    };
    zoobc.Transactions.getList(param).then(res => {
      this.lastClaim = res.transactionsList[0].timestamp;
    });
    zoobc.Mempool.getList(params)
      .then(res => {
        const pendingTxs = toUnconfirmTransactionNodeWallet(res);
        this.pendingNodeTx = pendingTxs;
        const params: NodeParams = {
          owner: this.account.address,
        };
        return zoobc.Node.get(params);
      })
      .then(res => {
        if (res) {
          const { registrationstatus } = res.noderegistration;
          if (registrationstatus == 0) this.registeredNode = res.noderegistration;
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
    Swal.fire({
      title: 'Are you sure want to generate new node public key?',
      text: 'You need to update your node registration or your node will stop smithing',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        zoobc.Node.generateNodeKey(this.account.nodeIP, this.authServ.seed)
          .then(res => {
            Swal.fire('Success', 'success', 'success');
          })
          .catch(err => {
            Swal.fire('Error', err, 'error');
          });
        return true;
      },
    });
  }

  streamNodeHardwareInfo() {
    this.isNodeHardwareLoading = true;
    this.isNodeHardwareError = false;
    zoobc.Node.getHardwareInfo(this.account.nodeIP, this.authServ.seed).subscribe(
      (res: any) => {
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
    });

    dialog.afterClosed().subscribe(success => {
      if (success) this.getRegisteredNode();
    });
  }

  openUpdateNode() {
    const dialog = this.dialog.open(UpdateNodeComponent, {
      width: '420px',
      data: this.registeredNode,
    });

    dialog.afterClosed().subscribe(success => {
      if (success) this.getRegisteredNode();
    });
  }

  openClaimNode() {
    const dialog = this.dialog.open(ClaimNodeComponent, {
      width: '420px',
      data: this.registeredNode,
    });

    dialog.afterClosed().subscribe(success => {
      if (success) this.getRegisteredNode();
    });
  }

  openRemoveNode() {
    const dialog = this.dialog.open(RemoveNodeComponent, {
      width: '420px',
      data: this.registeredNode,
    });

    dialog.afterClosed().subscribe(success => {
      if (success) this.getRegisteredNode();
    });
  }
}
