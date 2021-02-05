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

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { FormGroup } from '@angular/forms';
import { getTranslation } from 'src/helpers/utils';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import zoobc, { BIP32Interface, SetupDatasetInterface, SetupDatasetResponse } from 'zbc-sdk';
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
