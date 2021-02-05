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

import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Swal from 'sweetalert2';
import zoobc, {
  UpdateNodeInterface,
  ZBCAddressToBytes,
  isZBCAddressValid,
  getZBCAddress,
  NodeRegistration,
} from 'zbc-sdk';
import { NodeAdminService } from 'src/app/services/node-admin.service';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import {
  createUpdateNodeForm,
  updateNodeMap,
} from 'src/app/components/transaction-form/form-update-node/form-update-node.component';

@Component({
  selector: 'app-update-node',
  templateUrl: './update-node.component.html',
})
export class UpdateNodeComponent implements OnInit {
  formUpdateNode: FormGroup;
  account: SavedAccount;
  isLoading: boolean = false;
  isError: boolean = false;

  updateNodeMap = updateNodeMap;

  constructor(
    private authServ: AuthService,
    private NodeAdminServ: NodeAdminService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<UpdateNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public node: NodeRegistration,
    private translate: TranslateService
  ) {
    this.formUpdateNode = createUpdateNodeForm();

    const ipAddressForm = this.formUpdateNode.get('ipAddress');
    const nodePublicKeyForm = this.formUpdateNode.get('nodePublicKey');
    const lockedAmountForm = this.formUpdateNode.get('lockedAmount');

    this.account = authServ.getCurrAccount();
    ipAddressForm.patchValue(this.account.nodeIP);
    const formatAddressPubKey = getZBCAddress(
      Buffer.from(this.node.nodePublicKey.toString(), 'base64'),
      'ZNK'
    );
    const validFormatAddress = isZBCAddressValid(this.node.nodePublicKey, 'ZNK');

    if (validFormatAddress) nodePublicKeyForm.patchValue(this.node.nodePublicKey);
    else nodePublicKeyForm.patchValue(formatAddressPubKey);

    lockedAmountForm.patchValue(parseInt(this.node.lockedBalance) / 1e8);
    lockedAmountForm.setValidators([
      Validators.required,
      Validators.min(parseInt(this.node.lockedBalance) / 1e8),
    ]);
  }

  ngOnInit() {}

  onChangeNodePublicKey() {
    let isValid = isZBCAddressValid(this.formUpdateNode.get('nodePublicKey').value, 'ZNK');
    if (!isValid) this.formUpdateNode.get('nodePublicKey').setErrors({ invalidAddress: true });
  }

  onUpdateNode() {
    if (this.formUpdateNode.valid) {
      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
        maxHeight: '90vh',
      });

      pinRefDialog.afterClosed().subscribe(isPinValid => {
        if (isPinValid) {
          this.isLoading = true;
          this.isError = false;

          let data: UpdateNodeInterface = {
            accountAddress: this.account.address,
            fee: this.formUpdateNode.get('fee').value,
            nodePublicKey: ZBCAddressToBytes(this.formUpdateNode.get('nodePublicKey').value),
            nodeAddress: this.formUpdateNode.get('ipAddress').value,
            funds: this.formUpdateNode.get('lockedAmount').value,
          };

          zoobc.Node.update(data, this.authServ.seed)
            .then(() => {
              let message = getTranslation('your node will be updated soon', this.translate);
              Swal.fire('Success', message, 'success');

              // change IP if has different value
              if (this.formUpdateNode.get('ipAddress').value != this.account.nodeIP)
                this.NodeAdminServ.editIpAddress(this.formUpdateNode.get('ipAddress').value);

              this.dialogRef.close(true);
            })
            .catch(err => {
              console.log(err);
              Swal.fire('Error', err, 'error');
              this.isError = true;
            })
            .finally(() => (this.isLoading = false));
        }
      });
    }
  }
}
