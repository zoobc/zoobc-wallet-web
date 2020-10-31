import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import zoobc, {
  AccountDatasetListParams,
  AccountDatasets,
  RemoveDatasetInterface,
  BIP32Interface,
  AccountDataset,
} from 'zoobc-sdk';
import { getTranslation } from 'src/helpers/utils';
import { Subscription } from 'rxjs';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { SetupDatasetComponent } from './setup-dataset/setup-dataset.component';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import {
  createRemoveDatasetForm,
  removeDatasetMap,
} from 'src/app/components/transaction-form/form-remove-account-dataset/form-remove-account-dataset.component';
import { Account } from 'zoobc-sdk/types/helper/interfaces';
@Component({
  selector: 'app-account-dataset',
  templateUrl: './account-dataset.component.html',
  styleUrls: ['./account-dataset.component.scss'],
})
export class AccountDatasetComponent implements OnInit {
  subscription: Subscription = new Subscription();
  dataSetList: any[];
  dataSet: AccountDataset;

  isLoading: boolean;
  isError: boolean;
  isLoadingDelete: boolean;
  isErrorDelete: boolean;

  form: FormGroup;
  account: SavedAccount;
  accParam: Account;

  feeRefDialog: MatDialogRef<any>;
  @ViewChild('feedialog') feeDialog: TemplateRef<any>;

  removeDatasetMap = removeDatasetMap;

  constructor(
    public dialog: MatDialog,
    private authServ: AuthService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: SavedAccount
  ) {
    this.form = createRemoveDatasetForm();
    this.account = data;
    this.accParam = {
      address: this.account.address,
      type: 0,
    };
  }

  ngOnInit() {
    this.getDataSetList();
  }

  getDataSetList() {
    this.isError = false;
    this.isLoading = true;
    const listParam: AccountDatasetListParams = {
      recipient: this.accParam,
    };
    zoobc.AccountDataset.getList(listParam)
      .then((res: AccountDatasets) => {
        this.dataSetList = res.accountDatasets;
      })
      .catch(err => {
        this.isError = true;
        console.log(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  deleteDataSet() {
    this.isLoadingDelete = true;
    this.isErrorDelete = false;

    this.authServ.switchAccount(this.account);
    const seed: BIP32Interface = this.authServ.seed;

    let param: RemoveDatasetInterface = {
      setterAccountAddress: { address: this.dataSet.setter.address, type: 0 },
      recipientAccountAddress: { address: this.dataSet.recipient.address, type: 0 },
      property: this.dataSet.property,
      value: this.dataSet.value,
      fee: this.form.get('fee').value,
    };

    zoobc.AccountDataset.removeDataset(param, seed)
      .then(res => {
        let message = getTranslation('your request is processing', this.translate);
        let subMessage = getTranslation(
          'the dataset will remove when it has been successfully processed on the server',
          this.translate
        );
        Swal.fire(message, subMessage, 'success');
      })
      .catch(async err => {
        console.log(err);
        let message = getTranslation(err.message, this.translate);
        Swal.fire('Opps...', message, 'error');
        this.isErrorDelete = true;
        this.isLoadingDelete = false;
      })
      .finally(() => {
        this.isLoadingDelete = false;
      });
    this.feeRefDialog.close();
  }

  onDelete(dataset: AccountDataset) {
    this.dataSet = dataset;
    this.form.get('sender').patchValue(dataset.setter.address);
    this.form.get('property').patchValue(dataset.property);
    this.form.get('value').patchValue(dataset.value);
    this.form.get('recipientAddress').patchValue(dataset.recipient.address);
    this.isErrorDelete = false;
    this.isLoadingDelete = false;
    this.feeRefDialog = this.dialog.open(this.feeDialog, {
      width: '360px',
      maxHeight: '90vh',
    });
  }

  onOpenPinDialog() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });

    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        this.deleteDataSet();
      }
    });
  }

  onRefresh() {
    this.getDataSetList();
  }

  onSetupNewDataset() {
    let newRefDialog = this.dialog.open(SetupDatasetComponent, {
      width: '360px',
      maxHeight: '99vh',
      data: this.account,
      disableClose: true,
    });
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
  }
}
