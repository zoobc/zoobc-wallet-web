import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import {
  RemoveNodeInterface,
  removeNodeBuilder,
} from 'src/helpers/transaction-builder/remove-node';
import { KeyringService } from 'src/app/services/keyring.service';
import { ClaimNodeComponent } from './claim-node/claim-node.component';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

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

  isNodeHardwareLoading: boolean = false;
  isNodeHardwareError: boolean = false;
  isNodeLoading: boolean = false;
  isNodeError: boolean = false;

  constructor(
    private nodeAdminServ: NodeAdminService,
    private dialog: MatDialog,
    private router: Router,
    private nodeServ: NodeRegistrationService,
    private authServ: AuthService,
    private transactionServ: TransactionService,
    private keyringServ: KeyringService
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
    this.nodeServ.getRegisteredNode(this.account).then(
      (res: RegisteredNodeR) => {
        this.isNodeLoading = false;
        this.registeredNode = res.noderegistration;
      },
      err => {
        console.log(err);
        this.isNodeLoading = false;
        this.isNodeError = true;
      }
    );
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
  }

  openUpdateNode() {
    const dialog = this.dialog.open(UpdateNodeComponent, {
      width: '420px',
    });
  }

  openClaimNode() {
    const dialog = this.dialog.open(ClaimNodeComponent, {
      width: '420px',
    });
  }

  removeNode() {
    Swal.fire({
      title: `Are you sure want to remove this node?`,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        let data: RemoveNodeInterface = {
          accountAddress: this.account.address,
          nodePublicKey: this.registeredNode.nodepublickey.toString(),
          fee: environment.feeSlow,
        };
        let bytes = removeNodeBuilder(data, this.keyringServ);

        this.transactionServ.postTransaction(bytes).then(
          (res: any) => {
            Swal.fire('Success', 'success', 'success');
          },
          err => {
            console.log(err);
            Swal.fire('Error', err, 'error');
          }
        );
        return true;
      },
    });
  }
}
