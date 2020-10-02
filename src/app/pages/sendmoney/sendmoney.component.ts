import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContactService, Contact } from 'src/app/services/contact.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from 'src/environments/environment';
import { truncate, calcMinFee, getTranslation } from 'src/helpers/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import zoobc, { PostTransactionResponses, HostInfoResponse, TransactionType } from 'zoobc-sdk';
import { SendMoneyInterface } from 'zoobc-sdk/types/helper/transaction-builder/send-money';
import { ConfirmSendComponent } from './confirm-send/confirm-send.component';
import { sendMoneyForm, createInnerTxForm } from 'src/helpers/multisig-utils';

@Component({
  selector: 'app-sendmoney',
  templateUrl: './sendmoney.component.html',
  styleUrls: ['./sendmoney.component.scss'],
})
export class SendmoneyComponent implements OnInit {
  subscription: Subscription = new Subscription();

  currencyRate: Currency;

  kindFee: string;

  formSend: FormGroup;
  // recipientForm = new FormControl('', Validators.required);
  // amountForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  // amountCurrencyForm = new FormControl('', Validators.required);
  // feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  // feeFormCurr = new FormControl('', Validators.required);
  // aliasField = new FormControl('', Validators.required);
  // addressApproverField = new FormControl('', Validators.required);
  // approverCommissionField = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  // approverCommissionCurrField = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  // instructionField = new FormControl('', Validators.required);
  // timeoutField = new FormControl('', [Validators.required, Validators.min(1), Validators.max(720)]);
  // typeCoinField = new FormControl('ZBC');
  // typeFeeField = new FormControl('ZBC');
  // typeCommissionField = new FormControl('ZBC');

  sendMoneyRefDialog: MatDialogRef<any>;
  isLoading = false;
  isError = false;
  account: SavedAccount;
  // accounts: SavedAccount[];
  saveAddress: boolean = false;
  showSaveAddressBtn: boolean = true;
  saveAddressFeature: boolean = true;
  sendMoneyForm = sendMoneyForm;

  escrowForm = {
    addressApprover: 'addressApprover',
    typeCommission: 'typeCommission',
    approverCommissionCurr: 'approverCommissionCurr',
    approverCommission: 'approverCommission',
    timeout: 'timeout',
    instruction: 'instruction',
  };

  constructor(
    private authServ: AuthService,
    private currencyServ: CurrencyRateService,
    private contactServ: ContactService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    // this.formSend = new FormGroup({
    //   recipient: this.recipientForm,
    //   amount: this.amountForm,
    //   amountCurrency: this.amountCurrencyForm,
    //   typeCoin: this.typeCoinField,
    //   alias: this.aliasField,
    //   fee: this.feeForm,
    //   feeCurr: this.feeFormCurr,
    //   typeFee: this.typeFeeField,
    //   addressApprover: this.addressApproverField,
    //   approverCommission: this.approverCommissionField,
    //   approverCommissionCurr: this.approverCommissionCurrField,
    //   typeCommission: this.typeCommissionField,
    //   instruction: this.instructionField,
    //   timeout: this.timeoutField,
    // });
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
          kindFee: this.kindFee,
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
      // const approverCommissionField = this.formSend.get('approverCommission');
      // const addressApproverField = this.formSend.get('addressApprover');
      const recipientForm = this.formSend.get('recipient');
      // const timeoutField = this.formSend.get('timeout');
      // const instructionField = this.formSend.get('instruction');
      const amountCurrencyForm = this.formSend.get('amountCurrency');
      const aliasField = this.formSend.get('alias');

      let data: SendMoneyInterface = {
        sender: this.account.address,
        recipient: recipientForm.value,
        fee: feeForm.value,
        amount: amountForm.value,
        // approverAddress: addressApproverField.value,
        // commission: approverCommissionField.value,
        // timeout: timeoutField.value,
        // instruction: instructionField.value,
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
