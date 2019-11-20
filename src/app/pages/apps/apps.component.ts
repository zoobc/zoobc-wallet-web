import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss'],
})
export class AppsComponent implements OnInit {
  @ViewChild('appDialog') appDialog: TemplateRef<any>;
  addRefDialog: MatDialogRef<any>;

  constructor(private dialog: MatDialog, private translate: TranslateService) {}

  ngOnInit() {}

  openAddDialog() {
    this.addRefDialog = this.dialog.open(this.appDialog, {
      width: '400px',
    });
  }

  async onOpenComingSoon() {
    let message: string;
    await this.translate
      .get('Coming Soon')
      .toPromise()
      .then(res => (message = res));
    Swal.fire({
      type: 'info',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
    this.closeDialog();
  }

  closeDialog() {
    this.addRefDialog.close();
  }
}
