import { Component, OnInit, Input } from '@angular/core';
import {
  NodeAdminAttribute,
  NodeAdminService,
} from 'src/app/services/node-admin.service';
import { ReceiveComponent } from 'src/app/pages/receive/receive.component';
import { MatDialog } from '@angular/material';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() menu: string;

  nodeAdminAttribute: NodeAdminAttribute = {
    ipAddress: '',
  };
  nodeAdminAttributes: NodeAdminAttribute;

  constructor(
    private nodeAdminServ: NodeAdminService,
    private dialog: MatDialog,
    private appServ: AppService
  ) {
    this.nodeAdminServ.nodeAdminAttribute.subscribe(
      (attribute: NodeAdminAttribute) => {
        this.nodeAdminAttributes = attribute;
      }
    );
  }

  ngOnInit() {}

  onToggle() {
    this.appServ.toggle();
  }

  openReceiveForm() {
    this.dialog.open(ReceiveComponent, {
      width: '480px',
    });
  }
}
