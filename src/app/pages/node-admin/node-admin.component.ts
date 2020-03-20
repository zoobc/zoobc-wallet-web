import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  NodeHardware as NH,
  GetNodeHardwareResponse,
} from 'src/app/grpc/model/nodeHardware_pb';
import { RegisterNodeComponent } from './register-node/register-node.component';
import { UpdateNodeComponent } from './update-node/update-node.component';
import {
  GetNodeRegistrationResponse,
  NodeRegistration,
} from 'src/app/grpc/model/nodeRegistration_pb';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
// import { KeyringService } from 'src/app/services/keyring.service';
import { ClaimNodeComponent } from './claim-node/claim-node.component';
import Swal from 'sweetalert2';
import { RemoveNodeComponent } from './remove-node/remove-node.component';
import zoobc, {
  NodeParams,
  toUnconfirmTransactionNodeWallet,
  MempoolListParams,
} from 'zoobc-sdk';

type NodeHardware = NH.AsObject;
type NodeHardwareResponse = GetNodeHardwareResponse.AsObject;
type RegisteredNodeR = GetNodeRegistrationResponse.AsObject;
type RegisteredNode = NodeRegistration.AsObject;

@Component({
  selector: 'app-node-admin',
  templateUrl: './node-admin.component.html',
  styleUrls: ['./node-admin.component.scss'],
})
export class NodeAdminComponent implements OnInit {
  account: SavedAccount;
  // keyringServ: KeyringService;
  hwInfo: NodeHardware;
  mbToB = Math.pow(1024, 2);
  gbToB = Math.pow(1024, 3);

  registeredNode: RegisteredNode;
  pendingNodeTx = null;

  isNodeHardwareLoading: boolean = false;
  isNodeHardwareError: boolean = false;
  isNodeLoading: boolean = false;
  isNodeError: boolean = false;

  constructor(private dialog: MatDialog, private authServ: AuthService) {
    this.account = authServ.getCurrAccount();
  }

  ngOnInit() {
    this.getRegisteredNode();
    this.streamNodeHardwareInfo();
    // const seed =
    //   'c0a6e8e22681e240fb6af88a03ed9b9cfab7d35145f59ce1e578d214e863820e44b0c12e3688129f7235ea6972b1ef6f381756517c6703802e74479a1ea5e7f6';
    // this.keyringServ.calcBip32RootKeyFromSeed('ZBC', Buffer.from(seed, 'hex'));
  }

  getRegisteredNode() {
    this.isNodeLoading = true;
    this.isNodeError = false;
    this.pendingNodeTx = null;
    this.registeredNode = null;

    const params: MempoolListParams = {
      address: this.account.address,
    };
    zoobc.Mempool.getList(params)
      .then(res => {
        const pendingTxs = toUnconfirmTransactionNodeWallet(res);
        this.pendingNodeTx = pendingTxs;
        const params: NodeParams = {
          owner: this.account.address,
        };
        return zoobc.Node.get(params);
      })
      .then((res: RegisteredNodeR) => {
        this.registeredNode = res.noderegistration;
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
      text:
        'You need to update your node registration or your node will stop smithing',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        zoobc.Node.generateNodeKey(this.account.nodeIP, this.authServ.getSeed)
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
    zoobc.Node.getHardwareInfo(
      this.account.nodeIP,
      this.authServ.getSeed
    ).subscribe(
      (res: NodeHardwareResponse) => {
        this.isNodeHardwareLoading = false;
        this.hwInfo = res.nodehardware;
      },
      err => {
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
