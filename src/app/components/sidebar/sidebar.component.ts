import { Component, OnInit, Input } from '@angular/core';
import { NodeAdminAttribute, NodeAdminService } from 'src/app/services/node-admin.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() menu: string;

  nodeAdminAttribute: NodeAdminAttribute = {
    ipAddress: ''
  };
  nodeAdminAttributes: NodeAdminAttribute;

  constructor(
    private nodeAdminServ: NodeAdminService
  ) {
    this.nodeAdminServ.nodeAdminAttribute.subscribe((attribute: NodeAdminAttribute) => {
      this.nodeAdminAttributes = attribute;
    });
  }


  ngOnInit() { }
}
