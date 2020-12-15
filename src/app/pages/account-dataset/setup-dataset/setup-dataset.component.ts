import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { FormGroup } from '@angular/forms';
import { getTranslation } from 'src/helpers/utils';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import zoobc, { BIP32Interface, SetupDatasetResponse } from 'zbc-sdk';
import { SetupDatasetInterface } from 'zbc-sdk/types/helper/transaction-builder/setup-account-dataset';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import {
  createSetupDatasetForm,
  setupDatasetMap,
} from 'src/app/components/transaction-form/form-setup-account-dataset/form-setup-account-dataset.component';

@Component({
  selector: 'app-setup-dataset',
  templateUrl: './setup-dataset.component.html',
})
export class SetupDatasetComponent implements OnInit {
  isLoading: boolean;
  isError: boolean;

  formGroup: FormGroup;
  setupDatasetMap = setupDatasetMap;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private account: SavedAccount,
    private dialogRef: MatDialogRef<SetupDatasetComponent>,
    private authServ: AuthService,
    private translate: TranslateService
  ) {
    this.formGroup = createSetupDatasetForm();
    const sender = this.formGroup.get('sender');
    sender.patchValue(this.account.address.value);
  }

  ngOnInit() {}

  setupDataset() {
    this.authServ.switchAccount(this.account);
    this.isError = false;
    this.isLoading = true;
    const param: SetupDatasetInterface = {
      property: this.formGroup.get('property').value,
      value: this.formGroup.get('value').value,
      setterAccountAddress: { value: this.formGroup.get('sender').value, type: 0 },
      recipientAccountAddress: { value: this.formGroup.get('recipient').value, type: 0 },
      fee: this.formGroup.get('fee').value,
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
