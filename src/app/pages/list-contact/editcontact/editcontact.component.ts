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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContactService, Contact } from 'src/app/services/contact.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Address, isZBCAddressValid } from 'zbc-sdk';
import { getTranslation } from 'src/helpers/utils';

@Component({
  selector: 'app-editcontact',
  templateUrl: './editcontact.component.html',
})
export class EditcontactComponent implements OnInit {
  editForm: FormGroup;
  aliasField: FormControl;
  addressField: FormControl;

  constructor(
    private contactServ: ContactService,
    public dialogRef: MatDialogRef<EditcontactComponent>,
    @Inject(MAT_DIALOG_DATA) public contact: Contact,
    private translate: TranslateService
  ) {}

  onAddressValidation() {
    const validation = isZBCAddressValid(this.addressField.value, 'ZBC');
    if (!validation) {
      this.addressField.setErrors({ invalidAddress: true });
    }
  }

  ngOnInit() {
    this.aliasField = new FormControl(this.contact.name, Validators.required);
    this.addressField = new FormControl(this.contact.address.value, Validators.required);

    this.editForm = new FormGroup({
      name: this.aliasField,
      address: this.addressField,
    });
  }

  async onSubmit() {
    if (this.editForm.valid) {
      const isDuplicate = this.contactServ.isDuplicate(this.addressField.value);
      const isChanged = this.addressField.value != this.contact.address.value ? true : false;
      if (isDuplicate && isChanged) {
        let message = getTranslation('the address you entered is already in your contact', this.translate);
        Swal.fire({ type: 'error', title: 'Oops...', text: message });
      } else {
        const contact: Contact = {
          address: { value: this.addressField.value, type: 0 },
          name: this.aliasField.value,
        };
        const contacts: Contact[] = this.contactServ.update(contact, this.contact.address.value);
        this.dialogRef.close(contacts);
      }
    }
  }
}
