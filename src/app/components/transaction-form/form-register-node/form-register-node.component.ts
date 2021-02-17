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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isZBCAddressValid } from 'zbc-sdk';
import { Subscription } from 'rxjs';
import { escrowForm, escrowMap } from '../form-escrow/form-escrow.component';

@Component({
  selector: 'form-register-node',
  templateUrl: './form-register-node.component.html',
})
export class FormRegisterNodeComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() inputMap: any;

  minFee: number = environment.fee;
  subscription: Subscription = new Subscription();

  constructor() {}

  ngOnInit() {}

  onChangeNodePublicKey() {
    let isValid = isZBCAddressValid(this.group.get(this.inputMap.nodePublicKey).value, 'ZNK');
    if (!isValid) this.group.get(this.inputMap.nodePublicKey).setErrors({ invalidAddress: true });
  }
}

export const registerNodeMap = {
  ipAddress: 'ipAddress',
  lockedBalance: 'lockedBalance',
  fee: 'fee',
  nodePublicKey: 'nodePublicKey',
  ...escrowMap,
};

export function createRegisterNodeForm() {
  return new FormGroup({
    ipAddress: new FormControl('', [Validators.required, Validators.pattern('^https?://+[\\w.-]+:\\d+$')]),
    lockedBalance: new FormControl('', [Validators.required, Validators.min(1 / 1e8)]),
    fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
    nodePublicKey: new FormControl('', Validators.required),
    ...escrowForm(),
  });
}
