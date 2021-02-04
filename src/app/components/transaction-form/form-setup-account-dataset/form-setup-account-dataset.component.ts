// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

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

import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SetupDatasetInterface, setupDatasetBuilder } from 'zbc-sdk';
import { escrowForm, escrowMap } from '../form-escrow/form-escrow.component';

@Component({
  selector: 'form-setup-account-dataset',
  templateUrl: './form-setup-account-dataset.component.html',
})
export class FormSetupAccountDatasetComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  @Input() multisig: boolean = false;

  isSetupOther: boolean = false;

  constructor() {}

  ngOnInit() {
    this.setDefaultRecipient();
  }

  onToggleEnableSetupOther() {
    this.isSetupOther = !this.isSetupOther;
    if (!this.isSetupOther) this.setDefaultRecipient();
  }

  setDefaultRecipient() {
    const sender = this.group.get('sender').value;
    const recipientField = this.group.get('recipient');
    recipientField.patchValue(sender);
  }
}

export const setupDatasetMap = {
  sender: 'sender',
  property: 'property',
  value: 'value',
  recipient: 'recipient',
  fee: 'fee',
  ...escrowMap,
};

export function createSetupDatasetForm(): FormGroup {
  return new FormGroup({
    sender: new FormControl('', Validators.required),
    property: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required]),
    recipient: new FormControl('', Validators.required),
    fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
    ...escrowForm(),
  });
}

export function createSetupDatasetBytes(form: any): Buffer {
  const { sender, fee, recipient, property, value } = form;
  const data: SetupDatasetInterface = {
    property,
    value,
    setterAccountAddress: { value: sender, type: 0 },
    recipientAccountAddress: { value: recipient, type: 0 },
    fee,
  };
  return setupDatasetBuilder(data);
}
