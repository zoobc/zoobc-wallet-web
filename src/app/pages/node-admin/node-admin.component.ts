import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  NodeAdminAttribute,
  NodeAdminService,
} from 'src/app/services/node-admin.service';
import { MatDialog } from '@angular/material';
import {
  NodeHardware as NH,
  GetNodeHardwareResponse,
} from 'src/app/grpc/model/nodeHardware_pb';
import { Subscription } from 'rxjs';
import { NodeRegistrationService } from 'src/app/services/node-registration.service';
import { RegisterNodeComponent } from './register-node/register-node.component';
import { UpdateNodeComponent } from './update-node/update-node.component';
import {
  GetNodeRegistrationResponse,
  NodeRegistration,
} from 'src/app/grpc/model/nodeRegistration_pb';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';

type NodeHardware = NH.AsObject;
type NodeHardwareResponse = GetNodeHardwareResponse.AsObject;
type RegisteredNodeResponse = GetNodeRegistrationResponse.AsObject;
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
  isRegisteredNodeLoading: boolean = false;
  isRegisteredNodeError: boolean = false;

  constructor(
    private nodeAdminServ: NodeAdminService,
    private dialog: MatDialog,
    private router: Router,
    private nodeServ: NodeRegistrationService,
    private authServ: AuthService
  ) {
    this.account = authServ.getCurrAccount();

    nodeServ.getRegisteredNode().then((res: RegisteredNodeResponse) => {
      this.registeredNode = res.noderegistration;
    });

    this.isNodeHardwareLoading = true;
    this.isNodeHardwareError = false;
    nodeAdminServ.streamNodeHardwareInfo().subscribe(
      (res: NodeHardwareResponse) => {
        this.isNodeHardwareLoading = false;
        console.log(res);

        this.hwInfo = res.nodehardware;
      },
      err => {
        this.isNodeHardwareLoading = false;
        this.isNodeHardwareError = true;
      }
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.nodeAdminServ.stopNodeHardwareInfo();
  }

  openRegisterNode() {
    const dialog = this.dialog.open(RegisterNodeComponent, {
      width: '460px',
    });
  }

  openUpdateNode() {
    const dialog = this.dialog.open(UpdateNodeComponent, {
      width: '460px',
    });
  }
}
