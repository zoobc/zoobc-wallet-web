import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Input,
} from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-my-task-list',
  templateUrl: './my-task-list.component.html',
  styleUrls: ['./my-task-list.component.scss'],
})
export class MyTaskListComponent implements OnInit {
  @ViewChild('detailTask') detailTask: TemplateRef<any>;
  @Input() withDetail: boolean = false;
  detailTaskRefDialog: MatDialogRef<any>;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  onOpenDetailTask() {
    this.detailTaskRefDialog = this.dialog.open(this.detailTask, {
      width: '500px',
    });
  }

  onOpenDetailTaskComingSoon() {
    Swal.fire({
      type: 'info',
      title: 'COMING SOON',
      showConfirmButton: false,
      timer: 1500,
    });
  }
  closeDialog() {
    this.detailTaskRefDialog.close();
  }
  onConfirmDialog() {
    this.detailTaskRefDialog.close();
    Swal.fire({
      type: 'success',
      title: 'Transaction has been approved',
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
