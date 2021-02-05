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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { getTranslation } from 'src/helpers/utils';
import Swal from 'sweetalert2';
import zoobc, {
  MultiSigInterface,
  multisigPendingDetail,
  MultisigPostTransactionResponse,
  signTransactionHash,
} from 'zbc-sdk';

@Component({
  selector: 'app-multisig-detail',
  templateUrl: './multisig-detail.component.html',
  styleUrls: ['./multisig-detail.component.scss'],
})
export class MultisigDetailComponent implements OnChanges {
  @Input() txHash: string;
  @Output() dismiss: EventEmitter<boolean> = new EventEmitter();

  canSign: boolean = true;
  alreadySigned: boolean = false;

  isLoading: boolean = false;
  isError: boolean = false;
  isLoadingApprove: boolean = false;

  minSignature: number;
  totalSignature: number;

  multisig: multisigPendingDetail;

  form: FormGroup;
  minFee = environment.fee;
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);

  account: SavedAccount;
  participants: string[];

  mutisigMap = {
    fee: 'fee',
  };

  constructor(private dialog: MatDialog, private authServ: AuthService, private translate: TranslateService) {
    this.account = this.authServ.getCurrAccount();

    this.form = new FormGroup({
      fee: this.feeForm,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentDetail = changes.txHash.currentValue;
    const prevDetail = changes.txHash.previousValue;
    if (currentDetail != prevDetail) this.getMultisigDetail(this.txHash);
  }

  getMultisigDetail(txHash) {
    this.isLoading = true;
    this.isError = false;
    zoobc.MultiSignature.getPendingByTxHash(txHash).then((multisig: multisigPendingDetail) => {
      this.isLoading = false;
      this.minSignature = multisig.multisignatureinfo.minimumsignatures;
      this.totalSignature = multisig.pendingsignaturesList.length;
      this.multisig = multisig;

      const pendingSignatures = multisig.pendingsignaturesList.map(sign => sign.accountaddress.value);
      const participants = multisig.multisignatureinfo.addressesList.map(res => res.value);
      this.participants = participants.filter(participant => !pendingSignatures.includes(participant));

      this.canSign = this.canItSigned(this.multisig);
      this.alreadySigned = this.isAlreadySigned(this.multisig);
    });
  }

  canItSigned(multisig: multisigPendingDetail): boolean {
    const participants = multisig.multisignatureinfo.addressesList.map(res => res.value);
    const addresses = this.authServ
      .getAllAccount()
      .filter(address => participants.includes(address.address.value));

    if (addresses.length > 0) return true;
    else return false;
  }

  isAlreadySigned(multisig: multisigPendingDetail): boolean {
    const pendingSignatures = multisig.pendingsignaturesList;
    const participants = multisig.multisignatureinfo.addressesList.map(res => res.value);

    const addresses = this.authServ
      .getAllAccount()
      .filter(res => participants.includes(res.address.value))
      .map(res => res.address.value);
    const pendingSignAddresses = pendingSignatures.map(res => res.accountaddress.value);
    const result = addresses.filter(res => pendingSignAddresses.includes(res));

    if (result.length >= addresses.length) return true;
    return false;
  }

  onAccept() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });
    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        const seed = this.authServ.seed;
        this.isLoading = true;
        this.isError = false;

        let data: MultiSigInterface = {
          accountAddress: this.account.address,
          fee: this.feeForm.value,
          signaturesInfo: {
            txHash: this.multisig.pendingtransaction.transactionHash,
            participants: [
              {
                address: this.account.address,
                signature: signTransactionHash(this.multisig.pendingtransaction.transactionHash, seed),
              },
            ],
          },
        };
        zoobc.MultiSignature.postTransaction(data, seed)
          .then((res: MultisigPostTransactionResponse) => {
            this.isLoading = false;
            let message = getTranslation('transaction has been accepted', this.translate);
            Swal.fire({
              type: 'success',
              title: message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.onDismiss();

            // this.pendingListMultiSig = this.pendingListMultiSig.filter(
            //   tx => tx.transactionHash != this.multiSigDetail.transactionHash
            // );
          })
          .catch(err => {
            console.log(err.message);
            this.isError = true;
            this.isLoading = false;
            const message = getTranslation(err.message, this.translate);
            Swal.fire('Opps...', message, 'error');
          });
      }
    });
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
  }

  onDismiss() {
    this.dismiss.emit(true);
  }
}
