import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContactService, Contact } from 'src/app/services/contact.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Currency } from 'src/app/services/currency-rate.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { truncate, getTranslation } from 'src/helpers/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import zoobc, { PostTransactionResponses, TransactionType } from 'zoobc-sdk';
import { SendMoneyInterface } from 'zoobc-sdk/types/helper/transaction-builder/send-money';
import { ConfirmSendComponent } from './confirm-send/confirm-send.component';
import { sendMoneyForm, createInnerTxForm, escrowForm } from 'src/helpers/multisig-utils';

@Component({
  selector: 'app-sendmoney',
  templateUrl: './sendmoney.component.html',
  styleUrls: ['./sendmoney.component.scss'],
})
export class SendmoneyComponent implements OnInit {
  subscription: Subscription = new Subscription();

  currencyRate: Currency;

  formSend: FormGroup;

  sendMoneyRefDialog: MatDialogRef<any>;
  isLoading = false;
  isError = false;
  account: SavedAccount;
  saveAddress: boolean = false;

  sendMoneyForm = sendMoneyForm;
  escrowForm = escrowForm;

  constructor(
    private authServ: AuthService,
    private contactServ: ContactService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.formSend = createInnerTxForm(TransactionType.SENDMONEYTRANSACTION);
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
    const balance = this.account.balance / 1e8;
    if (balance >= total) {
      this.sendMoneyRefDialog = this.dialog.open(ConfirmSendComponent, {
        width: '500px',
        maxHeight: '90vh',
        data: {
          form: this.formSend.value,
          // advancedMenu: approverCommissionField.enabled,
          account: this.account,
          // currencyName: this.currencyRate.name,
          saveAddress: this.saveAddress,
          // alias: aliasField.value,
        },
      });
      this.sendMoneyRefDialog.afterClosed().subscribe(onConfirm => {
        if (onConfirm) {
          this.onOpenPinDialog();
        }
      });
    } else {
      let message = getTranslation('your balances are not enough for this transaction', this.translate, {
        amount: balance - feeForm.value,
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

      const amountForm = this.formSend.get('amount');
      const feeForm = this.formSend.get('fee');
      const approverCommissionField = this.formSend.get('approverCommission');
      const addressApproverField = this.formSend.get('addressApprover');
      const recipientForm = this.formSend.get('recipient');
      const timeoutField = this.formSend.get('timeout');
      const instructionField = this.formSend.get('instruction');
      const amountCurrencyForm = this.formSend.get('amountCurrency');
      const aliasField = this.formSend.get('alias');

      let data: SendMoneyInterface = {
        sender: this.account.address,
        recipient: recipientForm.value,
        fee: feeForm.value,
        amount: amountForm.value,
        approverAddress: addressApproverField.value,
        commission: approverCommissionField.value,
        timeout: timeoutField.value,
        instruction: instructionField.value,
      };
      // const txBytes = sendMoneyBuilder(data, this.keyringServ);
      const childSeed = this.authServ.seed;
      zoobc.Transactions.sendMoney(data, childSeed).then(
        async (res: PostTransactionResponses) => {
          this.isLoading = false;
          let message = getTranslation('your transaction is processing', this.translate);
          let subMessage = getTranslation('you send coins to', this.translate, {
            amount: data.amount,
            currencyValue: truncate(amountCurrencyForm.value, 2),
            // currencyName: this.currencyRate.name,
            recipient: data.recipient,
          });
          Swal.fire(message, subMessage, 'success');

          // save address
          if (this.saveAddress) {
            const newContact: Contact = {
              name: aliasField.value,
              address: recipientForm.value,
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
