// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.


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
  Address,
} from 'zbc-sdk';
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
  accParam: Address;

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
    this.accParam = this.account.address;
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
      setterAccountAddress: { value: this.dataSet.setter.value, type: 0 },
      recipientAccountAddress: { value: this.dataSet.recipient.value, type: 0 },
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
    this.form.get('sender').patchValue(dataset.setter.value);
    this.form.get('property').patchValue(dataset.property);
    this.form.get('value').patchValue(dataset.value);
    this.form.get('recipientAddress').patchValue(dataset.recipient.value);
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
