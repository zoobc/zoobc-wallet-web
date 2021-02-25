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

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { calculateMinimumFee } from 'zbc-sdk';
import { calcPer24Hour } from 'src/helpers/utils';

@Component({
  selector: 'form-message',
  templateUrl: './form-message.component.html',
  styleUrls: ['./form-message.component.scss'],
})
export class FormMessageComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() inputMap: any;

  showMessage: boolean = false;

  constructor() {}

  ngOnInit() {}

  toggleAdvancedMenu() {
    this.showMessage = !this.showMessage;
    this.enableFieldMessage();
    if (!this.showMessage) this.disableFieldMessage();
  }

  resetValue() {
    this.group.get(this.inputMap.message).reset();
  }

  enableFieldMessage() {
    this.group.get(this.inputMap.message).enable();
    this.resetValue();
    this.onCalculateMinimumFee();
  }

  disableFieldMessage() {
    this.group.get(this.inputMap.message).disable();
  }

  async onCalculateMinimumFee() {
    const instruction = this.group.get('instruction').value;
    const lengthInst = instruction ? instruction.length : 0;

    const message = this.group.get('message').value;
    const lengthMsg = message ? message.length : 0;

    const timeout = this.group.get('timeout').value;
    const hour = calcPer24Hour(timeout);

    const fee: number = timeout
      ? await parseFloat(calculateMinimumFee(lengthInst + lengthMsg, hour).toFixed(5))
      : 0.01;

    const feeForm = this.group.get('fee');
    feeForm.setValidators([Validators.required, Validators.min(fee)]);
    feeForm.patchValue(fee);
    feeForm.updateValueAndValidity();
    feeForm.markAsTouched();
  }
}
