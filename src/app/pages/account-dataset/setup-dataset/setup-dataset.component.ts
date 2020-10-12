import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { getTranslation } from 'src/helpers/utils';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import zoobc, { BIP32Interface, SetupDatasetResponse, TransactionType } from 'zoobc-sdk';
import { SetupDatasetInterface } from 'zoobc-sdk/types/helper/transaction-builder/setup-account-dataset';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { createInnerTxForm, setupDataSetForm } from 'src/helpers/multisig-utils';

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
  setupDatasetForm = setupDataSetForm;
  recipient: AbstractControl;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private account: SavedAccount,
    private dialogRef: MatDialogRef<SetupDatasetComponent>,
    private authServ: AuthService,
    private translate: TranslateService
  ) {
    this.formGroup = createInnerTxForm(TransactionType.SETUPACCOUNTDATASETTRANSACTION);
    let sender = this.formGroup.get('sender');
    sender.patchValue(this.account.address);
    this.recipient = this.formGroup.get('recipientAddress');
  }

  ngOnInit() {
    this.isSetupOther = false;
    this.disableSetupOther();
  }

  enableSetupOther() {
    this.recipient.enable();
  }

  disableSetupOther() {
    this.recipient.disable();
  }

  setupDataset() {
    this.authServ.switchAccount(this.account);
    this.isError = false;
    this.isLoading = true;
    if (!this.isSetupOther) this.recipient.patchValue(this.account.address);
    const param: SetupDatasetInterface = {
      property: this.formGroup.get('property').value,
      value: this.formGroup.get('value').value,
      setterAccountAddress: this.formGroup.get('sender').value,
      recipientAccountAddress: this.recipient.value,
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
