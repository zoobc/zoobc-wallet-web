import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';

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
      maxHeight: '90vh',
    });
  }

  async onOpenComingSoon() {
    const message = getTranslation('coming soon', this.translate);
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
