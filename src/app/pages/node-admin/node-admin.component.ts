import { Component, OnInit } from '@angular/core';
import { NodeAdminAttribute, NodeAdminService } from 'src/app/services/node-admin.service';

@Component({
  selector: 'app-node-admin',
  templateUrl: './node-admin.component.html',
  styleUrls: ['./node-admin.component.scss'],
})
export class NodeAdminComponent implements OnInit {
  public doughnutChartData = [70, 30];
  public doughnutChartType = 'doughnut';
  nodeAdminAttribute: NodeAdminAttribute = {
    ipAddress: ''
  };
  nodeAdminAttributes: NodeAdminAttribute;


  constructor(private nodeAdminServ: NodeAdminService
  ) {
    this.nodeAdminServ.nodeAdminAttribute.subscribe((attribute: NodeAdminAttribute) => {
      this.nodeAdminAttributes = attribute;
    });
  }

  ngOnInit() { }
}
