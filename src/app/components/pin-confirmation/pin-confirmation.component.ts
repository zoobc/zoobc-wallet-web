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

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import zoobc from 'zbc-sdk';
import { PinsComponent } from '../pins/pins.component';

@Component({
  selector: 'app-pin-confirmation',
  templateUrl: './pin-confirmation.component.html',
  styleUrls: ['./pin-confirmation.component.scss'],
})
export class PinConfirmationComponent implements OnInit {
  @ViewChild('pin') pin: PinsComponent;

  formConfirmPin: FormGroup;
  pinField = new FormControl('', Validators.required);

  isFormSendLoading = false;
  isConfirmPinLoading = false;

  constructor(public dialogRef: MatDialogRef<PinConfirmationComponent>) {
    this.formConfirmPin = new FormGroup({
      pin: this.pinField,
    });
  }

  ngOnInit() {}

  onTypePin() {
    if (this.pinField.value.length == 6) {
      this.isConfirmPinLoading = true;

      // give some delay so that the dom have time to render the spinner
      setTimeout(() => {
        const encPassphrase = localStorage.getItem('ENC_PASSPHRASE_SEED');
        const isPinValid = zoobc.Wallet.decryptPassphrase(encPassphrase, this.pinField.value);
        if (isPinValid) this.dialogRef.close(true);
        else {
          this.formConfirmPin.setErrors({ invalid: true });
          this.pin.onReset();
        }
        this.isConfirmPinLoading = false;
      }, 50);
    }
  }
}
