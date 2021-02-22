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

//     2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
// contact us at roberto.capodieci[at]blockchainzoo.com
// and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import Swal from 'sweetalert2';
import zoobc, { NodeRegistration, RemoveNodeInterface, ZBCAddressToBytes } from 'zbc-sdk';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import {
  createRemoveNodeForm,
  removeNodeMap,
} from 'src/app/components/transaction-form/form-remove-node/form-remove-node.component';

@Component({
  selector: 'app-remove-node',
  templateUrl: './remove-node.component.html',
})
export class RemoveNodeComponent implements OnInit {
  formRemoveNode: FormGroup;
  account: SavedAccount;
  isLoading: boolean = false;
  isError: boolean = false;
  removeNodeMap = removeNodeMap;

  constructor(
    private authServ: AuthService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RemoveNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public node: NodeRegistration,
    private translate: TranslateService
  ) {
    this.formRemoveNode = createRemoveNodeForm();
    this.account = authServ.getCurrAccount();
    this.formRemoveNode.get('nodePublicKey').patchValue(this.node.nodePublicKey);
  }

  ngOnInit() {}

  onRemoveNode() {
    if (this.formRemoveNode.valid) {
      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
        maxHeight: '90vh',
      });

      pinRefDialog.afterClosed().subscribe(isPinValid => {
        if (isPinValid) {
          this.isLoading = true;
          this.isError = false;

          let data: RemoveNodeInterface = {
            accountAddress: this.account.address,
            nodePublicKey: ZBCAddressToBytes(this.formRemoveNode.get('nodePublicKey').value),
            fee: this.formRemoveNode.get('fee').value,
            message: this.formRemoveNode.get('message').value,
          };
          zoobc.Node.remove(data, this.authServ.seed)
            .then(() => {
              let message = getTranslation('your node will be removed soon', this.translate);
              Swal.fire('Success', message, 'success');
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
