import { Component, OnInit } from '@angular/core';
import { NodeAdminService } from 'src/app/services/node-admin.service';
import { MatDialog } from '@angular/material';
import {
  NodeHardware as NH,
  GetNodeHardwareResponse,
} from 'src/app/grpc/model/nodeHardware_pb';
import { NodeRegistrationService } from 'src/app/services/node-registration.service';
import { RegisterNodeComponent } from './register-node/register-node.component';
import { UpdateNodeComponent } from './update-node/update-node.component';
import {
  GetNodeRegistrationResponse,
  NodeRegistration,
} from 'src/app/grpc/model/nodeRegistration_pb';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { ClaimNodeComponent } from './claim-node/claim-node.component';
import Swal from 'sweetalert2';
import { RemoveNodeComponent } from './remove-node/remove-node.component';

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

  hwInfo: NodeHardware;
  mbToB = Math.pow(1024, 2);
  gbToB = Math.pow(1024, 3);

  registeredNode: RegisteredNode;
  pendingNodeTx = null;

  isNodeHardwareLoading: boolean = false;
  isNodeHardwareError: boolean = false;
  isNodeLoading: boolean = false;
  isNodeError: boolean = false;

  constructor(
    private nodeAdminServ: NodeAdminService,
    private dialog: MatDialog,
    private nodeServ: NodeRegistrationService,
    authServ: AuthService,
    private transactionServ: TransactionService
  ) {
    this.account = authServ.getCurrAccount();
  }

  ngOnInit() {
    this.getRegisteredNode();
    this.streamNodeHardwareInfo();
  }

  ngOnDestroy() {
    this.nodeAdminServ.stopNodeHardwareInfo();
  }

  getRegisteredNode() {
    this.isNodeLoading = true;
    this.isNodeError = false;
    this.pendingNodeTx = null;
    this.registeredNode = null;

    this.nodeServ
      .getUnconfirmTransaction(this.account.address)
      .then(res => {
        this.pendingNodeTx = res;
        return this.nodeServ.getRegisteredNode(this.account);
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
        this.nodeAdminServ
          .generateNodeKey()
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
    this.nodeAdminServ.streamNodeHardwareInfo().subscribe(
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
