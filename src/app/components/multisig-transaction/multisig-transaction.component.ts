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
  selector: 'app-multisig-transaction',
  templateUrl: './multisig-transaction.component.html',
  styleUrls: ['./multisig-transaction.component.scss'],
})
export class MultisigTransactionComponent implements OnInit {
  @ViewChild('detailMultisig') detailMultisig: TemplateRef<any>;
  @Input() withDetail: boolean = false;
  detailMultisigRefDialog: MatDialogRef<any>;
  constructor(public dialog: MatDialog, private translate: TranslateService) {}

  ngOnInit() {}

  onOpenDetailTask() {
    this.detailMultisigRefDialog = this.dialog.open(this.detailMultisig, {
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
    this.detailMultisigRefDialog.close();
  }
  async onConfirmDialog() {
    this.detailMultisigRefDialog.close();
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
