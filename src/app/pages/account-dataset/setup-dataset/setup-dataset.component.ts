import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';
import { truncate, getTranslation } from 'src/helpers/utils';
import { Subscription } from 'rxjs';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import zoobc, { BIP32Interface, SetupDatasetResponse } from 'zoobc-sdk';
import { SetupDatasetInterface } from 'zoobc-sdk/types/helper/transaction-builder/setup-account-dataset';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-setup-dataset',
  templateUrl: './setup-dataset.component.html',
})
export class SetupDatasetComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  isSetupOther: boolean;
  isLoading: boolean;
  isError: boolean;
  minFee = environment.fee;
  currencyRate: Currency;

  formGroup: FormGroup;
  propertyField = new FormControl('', [Validators.required]);
  valueField = new FormControl('', [Validators.required]);
  recipientAddressField = new FormControl('', [Validators.required]);
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  timeoutField = new FormControl('', [Validators.required, Validators.min(1), Validators.max(720)]);
  typeFeeField = new FormControl('ZBC');

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private account: SavedAccount,
    private currencyServ: CurrencyRateService,
    private dialogRef: MatDialogRef<SetupDatasetComponent>,
    private authServ: AuthService,
    private translate: TranslateService
  ) {
    this.formGroup = new FormGroup({
      property: this.propertyField,
      value: this.valueField,
      recipientAddress: this.recipientAddressField,
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      typeFee: this.typeFeeField,
    });
  }

  ngOnInit() {
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      this.feeFormCurr.patchValue(minCurrency);
      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);
    this.isSetupOther = false;
    this.disableSetupOther();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  enableSetupOther() {
    this.recipientAddressField.enable();
  }

  disableSetupOther() {
    this.recipientAddressField.disable();
  }

  setupDataset() {
    this.authServ.switchAccount(this.account);
    this.isError = false;
    this.isLoading = true;
    let receipient = this.recipientAddressField.value;
    if (!this.isSetupOther) receipient = this.account.address;
    const param: SetupDatasetInterface = {
      property: this.propertyField.value,
      value: this.valueField.value,
      setterAccountAddress: this.account.address,
      recipientAccountAddress: receipient,
      fee: this.feeForm.value,
    };

    const seed: BIP32Interface = this.authServ.seed;
    zoobc.AccountDataset.setupDataset(param, seed)
      .then(async (res: SetupDatasetResponse) => {
        this.dialogRef.close();
        let message = getTranslation('your request is processing', this.translate);
        let subMessage = getTranslation(
          'the dataset will appears when it has been successfully processed on the server',
          this.translate
        );
        Swal.fire(message, subMessage, 'success');
      })
      .catch(async err => {
        this.isError = true;
        this.isLoading = false;
        console.log(err);
        let message = getTranslation(err.message, this.translate);
        Swal.fire('Opps...', message, 'error');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onClickSetupOther() {
    this.isSetupOther = !this.isSetupOther;
    if (!this.isSetupOther) return this.disableSetupOther();
    this.enableSetupOther();
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
