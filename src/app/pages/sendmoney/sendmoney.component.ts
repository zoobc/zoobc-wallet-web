import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { TransactionService } from '../../services/transaction.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { ContactService, Contact } from 'src/app/services/contact.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  CurrencyRateService,
  Currency,
} from 'src/app/services/currency-rate.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from 'src/environments/environment';
import { addressValidation, truncate } from 'src/helpers/utils';
import { Router } from '@angular/router';
import {
  sendMoneyBuilder,
  SendMoneyInterface,
} from 'src/helpers/transaction-builder/send-money';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';

@Component({
  selector: 'app-sendmoney',
  templateUrl: './sendmoney.component.html',
  styleUrls: ['./sendmoney.component.scss'],
})
export class SendmoneyComponent implements OnInit {
  contacts: Contact[];
  contact: Contact;
  filteredContacts: Observable<Contact[]>;

  @ViewChild('popupDetailSendMoney') popupDetailSendMoney: TemplateRef<any>;
  @ViewChild('accountDialog') accountDialog: TemplateRef<any>;

  currencyRate: Currency = {
    name: '',
    value: 0,
  };

  feeFast = environment.feeFast;
  feeMedium = environment.feeMedium;
  feeSlow = environment.feeSlow;
  activeButton: number = 2;
  kindFee: string;

  formSend: FormGroup;
  recipientForm = new FormControl('', Validators.required);
  amountForm = new FormControl('', [
    Validators.required,
    Validators.min(1 / 1e8),
  ]);
  amountCurrencyForm = new FormControl('', Validators.required);
  feeForm = new FormControl(this.feeMedium, [
    Validators.required,
    Validators.min(1 / 1e8),
  ]);
  feeFormCurr = new FormControl('', Validators.required);
  aliasField = new FormControl('', Validators.required);

  accountRefDialog: MatDialogRef<any>;
  sendMoneyRefDialog: MatDialogRef<any>;

  isLoading = false;
  isError = false;

  account: SavedAccount;
  accounts: SavedAccount[];

  typeCoin = 'ZBC';
  typeFee = 'ZBC';

  saveAddress: boolean = false;
  showSaveAddressBtn: boolean = true;
  customFee: boolean = false;

  constructor(
    private transactionServ: TransactionService,
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private currencyServ: CurrencyRateService,
    private contactServ: ContactService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.formSend = new FormGroup({
      recipient: this.recipientForm,
      amount: this.amountForm,
      amountCurrency: this.amountCurrencyForm,
      alias: this.aliasField,
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
    });
    // disable alias field (saveAddress = false)
    this.aliasField.disable();
  }

  ngOnInit() {
    this.contacts = this.contactServ.getContactList() || [];

    // set filtered contacts function
    this.filteredContacts = this.recipientForm.valueChanges.pipe(
      startWith(''),
      map(value => this.filterContacts(value))
    );

    this.currencyServ.currencyRate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      // set default fee to medium
      this.onChangeFeeField();
      // convert fee to current currency
      this.onFeeChoose(2);

      const minCurrency = truncate((1 / 1e8) * rate.value, 8);
      this.feeFormCurr.setValidators(Validators.min(minCurrency));
      this.amountCurrencyForm.setValidators(Validators.min(minCurrency));
    });

    this.account = this.authServ.getCurrAccount();
    this.getAccounts();
  }

  getAccounts() {
    this.isLoading = true;
    this.isError = false;
    this.authServ
      .getAccountsWithBalance()
      .then((res: SavedAccount[]) => {
        this.accounts = res;
        this.account = this.accounts.find(acc => this.account.path == acc.path);

        res.forEach(account => {
          const contact: Contact = {
            address: account.address,
            alias: account.name,
          };
          this.contacts.push(contact);
        });
      })
      .catch(() => (this.isError = true))
      .finally(() => (this.isLoading = false));
  }

  openAccountList() {
    this.accountRefDialog = this.dialog.open(this.accountDialog, {
      width: '360px',
    });
  }

  onSwitchAccount(account: SavedAccount) {
    this.authServ.switchAccount(account);
    this.account = account;
    this.accountRefDialog.close();
  }

  onChangeAmountField() {
    const amount = truncate(this.amountForm.value, 8);
    const amountCurrency = amount * this.currencyRate.value;
    this.amountCurrencyForm.patchValue(amountCurrency);
  }

  onChangeAmountCurrencyField() {
    const amount = this.amountCurrencyForm.value / this.currencyRate.value;
    const amountTrunc = truncate(amount, 8);
    this.amountForm.patchValue(amountTrunc);
  }

  onChangeFeeField() {
    const fee = truncate(this.feeForm.value, 8);
    const feeCurrency = fee * this.currencyRate.value;
    this.feeFormCurr.patchValue(feeCurrency);
  }

  onChangeFeeCurrencyField() {
    const fee = this.feeFormCurr.value / this.currencyRate.value;
    const feeTrunc = truncate(fee, 8);
    this.feeForm.patchValue(feeTrunc);
  }

  filterContacts(value: string): Contact[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.contacts.filter((contact: Contact) =>
        contact.alias.toLowerCase().includes(filterValue)
      );
    } else if (value == '') return this.contacts;
  }

  onChangeRecipient() {
    let validation = addressValidation(this.recipientForm.value);
    if (!validation) this.recipientForm.setErrors({ invalidAddress: true });
  }

  isAddressInContacts() {
    const isAddressInContacts = this.contacts.some(c => {
      if (c.address == this.recipientForm.value) {
        this.contact = c;
        return true;
      } else return false;
    });

    if (isAddressInContacts) {
      this.aliasField.disable();
      this.saveAddress = false;
      this.showSaveAddressBtn = false;
    } else {
      this.showSaveAddressBtn = true;
    }
  }

  toggleSaveAddress() {
    if (this.saveAddress) {
      this.aliasField.disable();
      this.saveAddress = false;
    } else {
      this.aliasField.enable();
      this.saveAddress = true;
    }
  }

  toggleCustomFee() {
    this.customFee = !this.customFee;
    if (!this.customFee) this.onFeeChoose(this.activeButton);
  }

  async onOpenDialogDetailSendMoney() {
    const total = this.amountForm.value + this.feeForm.value;
    if (this.account.balance / 1e8 >= total) {
      this.sendMoneyRefDialog = this.dialog.open(this.popupDetailSendMoney, {
        width: '500px',
        data: this.formSend.value,
      });
    } else {
      let message: string;
      await this.translate
        .get('Your balances are not enough for this transaction')
        .toPromise()
        .then(res => (message = res));
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  onOpenPinDialog() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
    });

    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        this.sendMoneyRefDialog.close();
        this.onSendMoney();
      }
    });
  }

  onFeeChoose(value) {
    let fee: number = 0;
    if (value === 1) {
      fee = this.feeSlow;
      this.kindFee = 'Slow';
    } else if (value === 2) {
      fee = this.feeMedium;
      this.kindFee = 'Average';
    } else {
      fee = this.feeFast;
      this.kindFee = 'Fast';
    }

    const feeCurrency = fee * this.currencyRate.value;
    this.formSend.patchValue({
      fee: fee,
      feeCurr: feeCurrency,
    });
    this.activeButton = value;
  }

  closeDialog() {
    this.sendMoneyRefDialog.close();
  }

  async onSendMoney() {
    if (this.formSend.valid) {
      this.isLoading = true;

      let data: SendMoneyInterface = {
        sender: this.account.address,
        recipient: this.recipientForm.value,
        fee: this.feeForm.value,
        amount: this.amountForm.value,
      };
      const txBytes = sendMoneyBuilder(data, this.keyringServ);

      this.transactionServ.postTransaction(txBytes).then(
        async (res: any) => {
          this.isLoading = false;
          let message: string;
          await this.translate
            .get('Your Transaction is processing')
            .toPromise()
            .then(res => (message = res));
          let subMessage: string;
          await this.translate
            .get('You send coins to this address', {
              amount: data.amount,
              currencyValue: data.amount * this.currencyRate.value,
              currencyName: this.currencyRate.name,
              recipient: data.recipient,
            })
            .toPromise()
            .then(res => (message = res));

          Swal.fire(`<b>${message}</b>`, subMessage, 'success');

          // save address
          if (this.saveAddress) {
            const newContact = {
              alias: this.aliasField.value,
              address: this.recipientForm.value,
            };
            this.contacts = this.contactServ.addContact(newContact);
          }

          this.sendMoneyRefDialog.close();
          this.router.navigateByUrl('/dashboard');
        },
        async err => {
          this.isLoading = false;

          let message: string;
          await this.translate
            .get('An error occurred while processing your request')
            .toPromise()
            .then(res => (message = res));
          Swal.fire('Opps...', message, 'error');
        }
      );
    }
  }
}
