import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { getTranslation } from 'src/helpers/utils';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import zoobc, { BIP32Interface, SetupDatasetResponse } from 'zoobc-sdk';
import { SetupDatasetInterface } from 'zoobc-sdk/types/helper/transaction-builder/setup-account-dataset';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-setup-dataset',
  templateUrl: './setup-dataset.component.html',
})
export class SetupDatasetComponent implements OnInit {
  isSetupOther: boolean;
  isLoading: boolean;
  isError: boolean;
  minFee = environment.fee;

  formGroup: FormGroup;
  propertyField = new FormControl('', [Validators.required]);
  valueField = new FormControl('', [Validators.required]);
  recipientAddressField = new FormControl('', [Validators.required]);
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  timeoutField = new FormControl('', [Validators.required, Validators.min(1), Validators.max(720)]);
  typeFeeField = new FormControl('ZBC');
  senderAddressField = new FormControl('', [Validators.required]);

  setupDataSetForm = {
    sender: 'sender',
    property: 'property',
    value: 'value',
    recipientAddress: 'recipientAddress',
    fee: 'fee',
    feeCurr: 'feeCurr',
    typeFee: 'typeFee',
  };

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private account: SavedAccount,
    private dialogRef: MatDialogRef<SetupDatasetComponent>,
    private authServ: AuthService,
    private translate: TranslateService
  ) {
    this.formGroup = new FormGroup({
      sender: this.senderAddressField,
      property: this.propertyField,
      value: this.valueField,
      recipientAddress: this.recipientAddressField,
      fee: this.feeForm,
    });
  }

  ngOnInit() {
    this.isSetupOther = false;
    this.disableSetupOther();
    this.senderAddressField.patchValue(this.account.address);
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
