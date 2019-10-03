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
  public doughnutChartData = [70, 30];
  public doughnutChartType = 'doughnut';
  nodeAdminAttribute: NodeAdminAttribute = {
    ipAddress: '',
  };
  nodeAdminAttributes: NodeAdminAttribute;

  hwInfo: NodeHardware;
  mbToB = Math.pow(1024, 2);
  gbToB = Math.pow(1024, 3);

  info: Subscription;

  registeredNode: RegisteredNode;

  constructor(
    private nodeAdminServ: NodeAdminService,
    private dialog: MatDialog,
    private router: Router,
    private nodeServ: NodeRegistrationService
  ) {
    this.nodeAdminServ.nodeAdminAttribute.subscribe(
      (attribute: NodeAdminAttribute) => {
        this.nodeAdminAttributes = attribute;
      }
    );

    nodeServ.getRegisteredNode().then((res: RegisteredNodeResponse) => {
      console.log(res);
      this.registeredNode = res.noderegistration;
    });

    nodeAdminServ
      .streamNodeHardwareInfo()
      .subscribe((res: NodeHardwareResponse) => {
        this.hwInfo = res.nodehardware;
      });
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
