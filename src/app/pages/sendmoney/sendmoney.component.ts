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

import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContactService, Contact } from 'src/app/services/contact.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { getTranslation } from 'src/helpers/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import zoobc, {
  AccountBalance,
  PostTransactionResponses,
  SendZBCInterface,
  LiquidTransactionsInterface,
} from 'zbc-sdk';
import { ConfirmSendComponent } from './confirm-send/confirm-send.component';
import {
  createSendMoneyForm,
  sendMoneyMap,
} from 'src/app/components/transaction-form/form-send-money/form-send-money.component';
import { environment } from 'src/environments/environment';
import moment from 'moment';

@Component({
  selector: 'app-sendmoney',
  templateUrl: './sendmoney.component.html',
  styleUrls: ['./sendmoney.component.scss'],
})
export class SendmoneyComponent implements OnInit {
  subscription: Subscription = new Subscription();

  formSend: FormGroup;

  sendMoneyRefDialog: MatDialogRef<any>;
  isLoading = false;
  isLoadingExtension = false;
  isError = false;
  account: SavedAccount;
  senderAccount: SavedAccount;
  saveAddress: boolean = false;

  sendMoneyMap = sendMoneyMap;
  accountBalance: any;

  extensionId = environment.extId;
  port;

  constructor(
    private authServ: AuthService,
    private contactServ: ContactService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private zone: NgZone
  ) {
    this.formSend = createSendMoneyForm();
    // disable alias field (saveAddress = false)
    // const aliasField = this.formSend.get('alias');
    const amountForm = this.formSend.get('amount');
    const recipientForm = this.formSend.get('recipient');

    // aliasField.disable();
    // disable some field where (advancedMenu = false)
    const amount = this.activeRoute.snapshot.params['amount'];
    const recipient = this.activeRoute.snapshot.params['recipient'];
    amountForm.patchValue(amount);
    recipientForm.patchValue(recipient);
  }

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    if (this.account.type == 'multisig' || this.account.type == 'address')
      this.router.navigateByUrl('/dashboard');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async onOpenDialogDetailSendMoney() {
    const amountForm = this.formSend.get('amount');
    const feeForm = this.formSend.get('fee');
    // const approverCommissionField = this.formSend.get('approverCommission');
    // const aliasField = this.formSend.get('alias');

    // this.getMinimumFee();
    const total = amountForm.value + feeForm.value;
    const sender = this.formSend.get('sender');
    await this.getBalance(sender.value);
    const balance = this.accountBalance.spendableBalance / 1e8;
    if (balance >= total) {
      // this.senderAccount = this.authServ.getAccountByAddressValue(sender.value);
      this.sendMoneyRefDialog = this.dialog.open(ConfirmSendComponent, {
        width: '500px',
        maxHeight: '90vh',
        data: {
          form: this.formSend.value,
          saveAddress: this.saveAddress,
        },
      });
      this.sendMoneyRefDialog.afterClosed().subscribe(onConfirm => {
        if (onConfirm) {
          if (this.account.type == 'imported' || this.account.type == 'one time login') {
            if (this.authServ.seed) return this.onSendMoney();
            else return this.sendDataToExtension();
          } else return this.onOpenPinDialog();
        }
      });
    } else {
      let message = getTranslation('your balances are not enough for this transaction', this.translate, {
        amount: balance - total,
      });
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  onOpenPinDialog() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });

    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        this.onSendMoney();
      }
    });
  }

  onSendMoney() {
    if (this.formSend.valid) {
      this.isLoading = true;

      const senderForm = this.formSend.get('sender');
      const amountForm = this.formSend.get('amount');
      const feeForm = this.formSend.get('fee');
      const approverCommissionField = this.formSend.get('approverCommission');
      const addressApproverField = this.formSend.get('addressApprover');
      const recipientForm = this.formSend.get('recipient');
      const timeoutField = this.formSend.get('timeout');
      const instructionField = this.formSend.get('instruction');
      const aliasField = this.formSend.get('alias');
      const messageField = this.formSend.get('message');
      const completeMinutesField = this.formSend.get('completeMinutes');

      const childSeed = this.authServ.seed;

      /** checking if completeMinutesField having value so that processing liquid transaction  */
      if (completeMinutesField && completeMinutesField.value) {
        let data: LiquidTransactionsInterface = {
          sender: { value: senderForm.value, type: 0 },
          recipient: { value: recipientForm.value, type: 0 },
          fee: feeForm.value,
          amount: amountForm.value,
          approverAddress: { value: addressApproverField.value, type: 0 },
          commission: approverCommissionField.value,
          instruction: instructionField.value,
          message: messageField.value,
          completeMinutes: completeMinutesField.value,
          timeout: timeoutField.value
            ? moment(timeoutField.value)
                .utc()
                .unix()
            : null,
        };

        zoobc.Liquid.sendLiquid(data, childSeed).then(
          async (res: PostTransactionResponses) => {
            this.isLoading = false;
            let message = getTranslation('your transaction is processing', this.translate);
            let subMessage = getTranslation('you transfer zbc to ', this.translate) + data.recipient.value;
            Swal.fire(message, subMessage, 'success');
            this.router.navigateByUrl('/dashboard');
          },
          async err => {
            this.isLoading = false;
            console.log(err);

            let message = getTranslation(err.message, this.translate);
            Swal.fire('Opps...', message, 'error');
          }
        );
      } else {
        let data: SendZBCInterface = {
          sender: { value: senderForm.value, type: 0 },
          recipient: { value: recipientForm.value, type: 0 },
          fee: feeForm.value,
          amount: amountForm.value,
          approverAddress: { value: addressApproverField.value, type: 0 },
          commission: approverCommissionField.value,
          instruction: instructionField.value,
          message: messageField.value,
          timeout: timeoutField.value
            ? moment(timeoutField.value)
                .utc()
                .unix()
            : null,
        };

        zoobc.Transactions.SendZBC(data, childSeed).then(
          async (res: PostTransactionResponses) => {
            this.isLoading = false;
            let message = getTranslation('your transaction is processing', this.translate);
            let subMessage = getTranslation('you transfer zbc to ', this.translate) + data.recipient.value;
            Swal.fire(message, subMessage, 'success');

            // save address
            if (aliasField.value) {
              const newContact: Contact = {
                name: aliasField.value,
                address: { value: recipientForm.value, type: 0 },
              };
              this.contactServ.add(newContact);
            }

            this.router.navigateByUrl('/dashboard');
          },
          async err => {
            this.isLoading = false;
            console.log(err);

            let message = getTranslation(err.message, this.translate);
            Swal.fire('Opps...', message, 'error');
          }
        );
      }
    }
  }

  async getBalance(address: string) {
    await zoobc.Account.getBalance({ value: address, type: 0 }).then((data: AccountBalance) => {
      this.accountBalance = data;
    });
  }

  sendDataToExtension() {
    try {
      this.isLoadingExtension = true;
      this.port = chrome.runtime.connect(this.extensionId);
      this.port.postMessage({
        action: 'get-signature',
        transaction: this.formSend.value,
        path: this.account.path,
      });
      this.port.onMessage.addListener(msg => {
        this.zone.run(() => {
          let message = '';
          switch (msg.message) {
            case 'failed':
              message = getTranslation('extension closed', this.translate);
              this.isLoadingExtension = false;
              Swal.fire('Opps...', message, 'error');
              break;
            case 'cancel':
              message = getTranslation('extension cancel the operation', this.translate);
              this.isLoadingExtension = false;
              Swal.fire('Opps...', message, 'error');
              break;
            case 'success':
              this.sendMoneyHardware(msg.signature);
              break;
            default:
              this.isLoadingExtension = false;
          }
        });
      });
    } catch (error) {
      let message = getTranslation('extension not found', this.translate);
      return Swal.fire('Opps...', message, 'error');
    }
  }

  sendMoneyHardware(signature: any) {
    signature = Buffer.from(signature);

    this.isLoadingExtension = false;
    this.isLoading = true;

    const amountForm = this.formSend.get('amount');
    const recipientForm = this.formSend.get('recipient');
    const aliasField = this.formSend.get('alias');

    zoobc.Transactions.post(signature).then(
      async (res: PostTransactionResponses) => {
        this.isLoading = false;
        let message = getTranslation('your transaction is processing', this.translate);
        let subMessage = getTranslation('you transfer zbc to', this.translate, {
          amount: amountForm.value,
          recipient: recipientForm.value,
        });
        Swal.fire(message, subMessage, 'success');

        // save address
        if (aliasField.value) {
          const newContact: Contact = {
            name: aliasField.value,
            address: { value: recipientForm.value, type: 0 },
          };
          this.contactServ.add(newContact);
        }
        this.router.navigateByUrl('/dashboard');
      },
      async err => {
        this.isLoading = false;
        console.log(err);

        let message = getTranslation(err.message, this.translate);
        Swal.fire('Opps...', message, 'error');
      }
    );
  }
}
