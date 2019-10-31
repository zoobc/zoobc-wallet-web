import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss'],
})
export class AppsComponent implements OnInit {
  @ViewChild('appDialog') appDialog: TemplateRef<any>;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openAddDialog() {
    const dialog = this.dialog.open(this.appDialog, {
      width: '400px',
    });
  }
}
