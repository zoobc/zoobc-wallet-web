import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Input,
} from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-task-list',
  templateUrl: './my-task-list.component.html',
  styleUrls: ['./my-task-list.component.scss'],
})
export class MyTaskListComponent implements OnInit {
  @ViewChild('detailTask') detailTask: TemplateRef<any>;
  @Input() withDetail: boolean = false;
  detailTaskRefDialog: MatDialogRef<any>;

  constructor(public dialog: MatDialog, private translate: TranslateService) {}

  ngOnInit() {}

  onOpenDetailTask() {
    this.detailTaskRefDialog = this.dialog.open(this.detailTask, {
      width: '500px',
    });
  }

  async onOpenDetailTaskComingSoon() {
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
    this.closeDialog()
  }
  closeDialog() {
    this.detailTaskRefDialog.close();
  }
  async onConfirmDialog() {
    this.detailTaskRefDialog.close();
    let message: string;
    await this.translate
      .get('Transaction has been approved')
      .toPromise()
      .then(res => (message = res));
    Swal.fire({
      type: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
