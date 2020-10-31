import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';

@Component({
  selector: 'app-confirm-send',
  templateUrl: './confirm-send.component.html',
  styleUrls: ['./confirm-send.component.scss'],
})
export class ConfirmSendComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmSendComponent>,
    private currencyServ: CurrencyRateService
  ) {}
  form: any;
  advancedMenu: boolean = false;
  currencyRate: Currency;
  subsRate: Subscription;

  ngOnInit() {
    this.subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });
    this.form = this.data.form;
    if (this.data.form.addressApprover) this.advancedMenu = true;
  }

  ngOnDestroy() {
    if (this.subsRate) this.subsRate.unsubscribe();
  }

  closeDialog() {
    this.dialog.closeAll();
  }
  onConfirm() {
    this.dialogRef.close(true);
  }
}
