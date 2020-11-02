import { Component, OnInit } from '@angular/core';
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
import zoobc, { AccountBalance, PostTransactionResponses } from 'zoobc-sdk';
import { SendMoneyInterface } from 'zoobc-sdk/types/helper/transaction-builder/send-money';
import { ConfirmSendComponent } from './confirm-send/confirm-send.component';
import {
  createSendMoneyForm,
  sendMoneyMap,
} from 'src/app/components/transaction-form/form-send-money/form-send-money.component';

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
  isError = false;
  account: SavedAccount;
  saveAddress: boolean = false;

  sendMoneyMap = sendMoneyMap;
  accountBalance: any;

  constructor(
    private authServ: AuthService,
    private contactServ: ContactService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.formSend = createSendMoneyForm();
    // disable alias field (saveAddress = false)
    const aliasField = this.formSend.get('alias');
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
    if (this.account.type == 'multisig') {
      let message = getTranslation('please use normal account to use this feature', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
      this.router.navigateByUrl('/dashboard');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async onOpenDialogDetailSendMoney() {
    const amountForm = this.formSend.get('amount');
    const feeForm = this.formSend.get('fee');
    // const approverCommissionField = this.formSend.get('approverCommission');
    const aliasField = this.formSend.get('alias');

    // this.getMinimumFee();
    const total = amountForm.value + feeForm.value;
    const sender = this.formSend.get('sender');
    await this.getBalance(sender.value);
    const balance = this.accountBalance.spendableBalance / 1e8;
    if (balance >= total) {
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
          this.onOpenPinDialog();
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

      let data: SendMoneyInterface = {
        sender: { value: senderForm.value, type: 0 },
        recipient: { value: recipientForm.value, type: 0 },
        fee: feeForm.value,
        amount: amountForm.value,
        approverAddress: { value: addressApproverField.value, type: 0 },
        commission: approverCommissionField.value,
        timeout: timeoutField.value,
        instruction: instructionField.value,
      };
      const childSeed = this.authServ.seed;
      zoobc.Transactions.sendMoney(data, childSeed).then(
        async (res: PostTransactionResponses) => {
          this.isLoading = false;
          let message = getTranslation('your transaction is processing', this.translate);
          let subMessage = getTranslation('you send coins to', this.translate, {
            amount: data.amount,
            recipient: data.recipient.value,
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

  async getBalance(address: string) {
    await zoobc.Account.getBalance({ value: address, type: 0 }).then((data: AccountBalance) => {
      this.accountBalance = data;
    });
  }
}
