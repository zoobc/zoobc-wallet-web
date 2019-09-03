import { Component, OnInit } from '@angular/core';
import {
  NodeAdminAttribute,
  NodeAdminService,
} from 'src/app/services/node-admin.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
// import { ChangeIpAddressComponent } from '../change-ip-address/change-ip-address.component';

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

  constructor(
    private nodeAdminServ: NodeAdminService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.nodeAdminServ.nodeAdminAttribute.subscribe(
      (attribute: NodeAdminAttribute) => {
        this.nodeAdminAttributes = attribute;
      }
    );
  }

  ngOnInit() {}
  openRegisterNodeForm() {
    this.router.navigateByUrl('nodeadmin/register');
  }
  openUpdateNodeForm() {
    this.router.navigateByUrl('nodeadmin/updatenode');
  }
}
