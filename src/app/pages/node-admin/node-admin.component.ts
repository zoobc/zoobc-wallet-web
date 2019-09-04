import { Component, OnInit } from '@angular/core';
import {
  NodeAdminAttribute,
  NodeAdminService,
} from 'src/app/services/node-admin.service';
import { MatDialog } from '@angular/material';
import { ChangeIpAddressComponent } from '../change-ip-address/change-ip-address.component';
import {
  NodeHardware as NH,
  GetNodeHardwareResponse,
} from 'src/app/grpc/model/nodeHardware_pb';

type NodeHardware = NH.AsObject;
type NodeHardwareResponse = GetNodeHardwareResponse.AsObject;

@Component({
  selector: 'app-node-admin',
  templateUrl: './node-admin.component.html',
  styleUrls: ['./node-admin.component.scss'],
})
export class NodeAdminComponent implements OnInit {
  nodeAdminIPAddress;
  public doughnutChartData = [70, 30];
  public doughnutChartType = 'doughnut';
  nodeAdminAttribute: NodeAdminAttribute = {
    ipAddress: '',
  };
  nodeAdminAttributes: NodeAdminAttribute;

  hwInfo: NodeHardware;
  mbToB = Math.pow(1024, 2);

  constructor(
    private nodeAdminServ: NodeAdminService,
    private dialog: MatDialog
  ) {
    this.nodeAdminServ.nodeAdminAttribute.subscribe(
      (attribute: NodeAdminAttribute) => {
        this.nodeAdminAttributes = attribute;
      }
    );

    nodeAdminServ
      .getNodeHardwareInfo()
      .subscribe((res: NodeHardwareResponse) => {
        this.hwInfo = res.nodehardware;
      });
  }

  ngOnInit() {
    this.nodeAdminIPAddress = this.nodeAdminServ.getNodeAdminList();
  }

  onOpenChangeIPAddress(nodeAdminAttributes) {
    const dialog = this.dialog.open(ChangeIpAddressComponent, {
      width: '460px',
      data: nodeAdminAttributes,
    });

    dialog.afterClosed().subscribe(nodeAdminAttributes => {
      if (nodeAdminAttributes) this.nodeAdminIPAddress = nodeAdminAttributes;
    });
    console.log(nodeAdminAttributes);
  }
}
