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

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NodeAdminService } from 'src/app/services/node-admin.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import zoobc, { RequestType } from 'zbc-sdk';
import { AuthService } from 'src/app/services/auth.service';
import { getTranslation } from 'src/helpers/utils';

@Component({
  selector: 'app-add-node-admin',
  templateUrl: './add-node-admin.component.html',
})
export class AddNodeAdminComponent {
  isLoading: boolean = false;
  formAddNodeAdmin: FormGroup;
  ipAddressField = new FormControl('', [
    Validators.required,
    Validators.pattern('^https?://+[\\w.-]+:\\d+$'),
  ]);
  constructor(
    private dialogRef: MatDialogRef<AddNodeAdminComponent>,
    private nodeAdminServ: NodeAdminService,
    private router: Router,
    private translate: TranslateService,
    private authSrv: AuthService
  ) {
    this.formAddNodeAdmin = new FormGroup({
      ipAddress: this.ipAddressField,
    });
  }

  onAddNodeAdmin() {
    if (this.formAddNodeAdmin.valid) {
      this.isLoading = true;
      const childSeed = this.authSrv.seed;
      console.log('--- childSeed: ', childSeed);
      const auth: string = zoobc.Poown.createAuth(RequestType.GETPROOFOFOWNERSHIP, childSeed);

      zoobc.Poown.request(auth, this.ipAddressField.value)
        .then(async () => {
          let message = getTranslation('node admin added!', this.translate);
          this.isLoading = false;
          this.nodeAdminServ.addNodeAdmin(this.ipAddressField.value);
          Swal.fire('', message, 'success').then(() => {
            this.dialogRef.close();
            setTimeout(() => {
              this.router.navigateByUrl('/nodeadmin');
            }, 400);
          });
        })
        .catch(async err => {
          let message = getTranslation(err.message, this.translate);
          Swal.fire('Opps...', message, 'error');
          this.isLoading = false;
        });
    }
  }
}
