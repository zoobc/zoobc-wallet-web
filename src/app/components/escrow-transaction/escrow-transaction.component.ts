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
  selector: 'app-escrow-transaction',
  templateUrl: './escrow-transaction.component.html',
  styleUrls: ['./escrow-transaction.component.scss'],
})
export class EscrowTransactionComponent implements OnInit {
  @ViewChild('detailEscrow') detailEscrow: TemplateRef<any>;
  @Input() withDetail: boolean = false;
  detailEscrowRefDialog: MatDialogRef<any>;

  constructor(public dialog: MatDialog, private translate: TranslateService) {}

  ngOnInit() {}

  onOpenDetailTask() {
    this.detailEscrowRefDialog = this.dialog.open(this.detailEscrow, {
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
    this.closeDialog();
  }
  closeDialog() {
    this.detailEscrowRefDialog.close();
  }
  async onConfirmDialog() {
    this.detailEscrowRefDialog.close();
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
