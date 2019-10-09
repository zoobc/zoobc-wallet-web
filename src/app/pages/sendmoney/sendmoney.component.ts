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
import { addressValidation, generateEncKey } from 'src/helpers/utils';
import { Router } from '@angular/router';
import { SendMoney } from 'src/helpers/transaction-builder/send-money';

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
  @ViewChild('pinDialog') pinDialog: TemplateRef<any>;
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
  amountCurrencyForm = new FormControl('', [
    Validators.required,
    Validators.min(1 / 1e8),
  ]);
  feeForm = new FormControl(this.feeMedium, [
    Validators.required,
    Validators.min(1 / 1e8),
  ]);
  feeFormCurr = new FormControl('', [
    Validators.required,
    Validators.min(1 / 1e8),
  ]);
  aliasField = new FormControl('', Validators.required);

  formConfirmPin: FormGroup;
  pinField = new FormControl('', Validators.required);

  pinRefDialog: MatDialogRef<any>;
  accountRefDialog: MatDialogRef<any>;
  sendMoneyRefDialog: MatDialogRef<any>;

  isFormSendLoading = false;
  isConfirmPinLoading = false;

  account: SavedAccount;
  accounts: SavedAccount[];

  bytes = new Uint8Array(193);
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

    this.formConfirmPin = new FormGroup({
      pin: this.pinField,
    });
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
    });

    this.account = this.authServ.getCurrAccount();
    this.accounts = this.authServ.getAllAccount(true);
    this.account = this.accounts.find(acc => this.account.path == acc.path);
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
    const amountCurrency = this.amountForm.value * this.currencyRate.value;
    this.amountCurrencyForm.patchValue(amountCurrency);
  }

  onChangeAmountCurrencyField() {
    const amount = this.amountCurrencyForm.value / this.currencyRate.value;
    this.amountForm.patchValue(amount);
  }

  onChangeFeeField() {
    const feeCurrency = this.feeForm.value * this.currencyRate.value;
    this.feeFormCurr.patchValue(feeCurrency);
  }

  onChangeFeeCurrencyField() {
    const fee = this.feeFormCurr.value / this.currencyRate.value;
    this.feeForm.patchValue(fee);
  }

  filterContacts(value: string) {
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
    if (!this.customFee) {
      this.onFeeChoose(this.activeButton);
    }
  }

  onOpenDialogDetailSendMoney() {
    const total = this.amountForm.value + this.feeForm.value;
    if (this.account.balance / 1e8 >= total) {
      this.sendMoneyRefDialog = this.dialog.open(this.popupDetailSendMoney, {
        width: '500px',
        data: this.formSend.value,
      });
    } else {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Your balances are not enough for this transaction',
      });
    }
  }

  onOpenPinDialog() {
    this.pinRefDialog = this.dialog.open(this.pinDialog, {
      width: '400px',
    });

    this.pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) this.onSendMoney();
    });
  }

  onFeeChoose(value) {
    let fee: number = 0;
    if (value === 1) {
      fee = this.feeSlow;
      this.kindFee = 'Slow';
    } else if (value === 2) {
      fee = this.feeMedium;
      this.kindFee = 'Medium';
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

  onTypePin() {
    if (this.pinField.value.length == 6) {
      this.isConfirmPinLoading = true;

      // give some delay so that the dom have time to render the spinner
      setTimeout(() => {
        const key = generateEncKey(this.pinField.value);
        const isPinValid = this.authServ.isPinValid(key);
        if (isPinValid) {
          this.pinRefDialog.close(true);
          this.sendMoneyRefDialog.close();
        } else {
          this.formConfirmPin.setErrors({ invalid: true });
        }
        this.isConfirmPinLoading = false;
      }, 50);
    }
  }

  closeDialog() {
    this.sendMoneyRefDialog.close();
  }

  async onSendMoney() {
    if (this.formSend.valid) {
      this.isFormSendLoading = true;

      const txBytes = new SendMoney();
      txBytes.authServ = this.authServ;
      txBytes.keyringServ = this.keyringServ;

      txBytes.sender = this.account.address;
      txBytes.recipient = this.recipientForm.value;
      txBytes.fee = this.feeForm.value;
      txBytes.amount = this.amountForm.value;
      txBytes.sign();

      this.transactionServ.postTransaction(txBytes.value).then(
        (res: any) => {
          this.isFormSendLoading = false;
          Swal.fire(
            '<b>Your Transaction is processing</b>',
            'You send <b>' +
              this.amountForm.value +
              '</b> coins (' +
              this.amountForm.value * this.currencyRate.value +
              ' ' +
              this.currencyRate.name +
              ') ' +
              'to this <b>' +
              this.recipientForm.value +
              '</b> address',
            'success'
          );

          // save address
          if (this.saveAddress) {
            const newContact = {
              alias: this.aliasField.value,
              address: this.recipientForm.value,
            };
            this.contacts = this.contactServ.addContact(newContact);
          }

          // reset the form
          this.formSend.reset();
          Object.keys(this.formSend.controls).forEach(key => {
            this.formSend.controls[key].setErrors(null);
          });
          this.router.navigateByUrl('/dashboard');
        },
        err => {
          this.isFormSendLoading = false;
          Swal.fire(
            'Opps...',
            'An error occurred while processing your request',
            'error'
          );
        }
      );
    }
  }
}
