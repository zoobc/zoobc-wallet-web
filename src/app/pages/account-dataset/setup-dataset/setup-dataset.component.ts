import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SavedAccount } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';
import { truncate } from 'src/helpers/utils';
import { Subscription } from 'rxjs';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';

@Component({
  selector: 'app-setup-dataset',
  templateUrl: './setup-dataset.component.html',
  styleUrls: ['./setup-dataset.component.scss'],
})
export class SetupDatasetComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  isSetupOther: boolean;
  isLoading: boolean;
  isError: boolean;
  minFee = environment.fee;
  kindFee: string;
  currencyRate: Currency;
  customFee: boolean = false;

  formGroup: FormGroup;
  propertyField = new FormControl('', [Validators.required]);
  valueField = new FormControl('', [Validators.required]);
  recipientAddressField = new FormControl('', [Validators.required]);
  feeForm = new FormControl(this.minFee * 2, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  timeoutField = new FormControl('', [Validators.required, Validators.min(1), Validators.max(720)]);

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private account: SavedAccount,
    private currencyServ: CurrencyRateService,
    private dialogRef: MatDialogRef<SetupDatasetComponent>
  ) {
    this.formGroup = new FormGroup({
      property: this.propertyField,
      value: this.valueField,
      recipientAddress: this.recipientAddressField,
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
    });
  }

  ngOnInit() {
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);
    this.isSetupOther = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  enableSetupOther() {
    this.recipientAddressField.enable();
    this.feeForm.enable();
  }

  disableSetupOther() {
    this.recipientAddressField.disable();
    this.feeForm.disable();
  }

  setupDataset() {}

  onClickSetupOther() {
    this.isSetupOther = !this.isSetupOther;
    if (!this.isSetupOther) return this.disableSetupOther();
    this.enableSetupOther();
  }

  onClickFeeChoose(value) {
    this.kindFee = value;
  }
  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });
    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        this.setupDataset();
      }
    });
  }
}
