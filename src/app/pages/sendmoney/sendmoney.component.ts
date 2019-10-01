import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

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
import { BytesMaker } from 'src/helpers/BytesMaker';
import {
  GetAccountBalanceResponse,
  AccountBalance as AB,
} from 'src/app/grpc/model/accountBalance_pb';
import { AccountService } from 'src/app/services/account.service';
import { environment } from 'src/environments/environment';
import { addressValidation } from 'src/helpers/utils';

const coin = 'ZBC';
type AccountBalance = AB.AsObject;
type AccountBalanceList = GetAccountBalanceResponse.AsObject;

@Component({
  selector: 'app-sendmoney',
  templateUrl: './sendmoney.component.html',
  styleUrls: ['./sendmoney.component.scss'],
})
export class SendmoneyComponent implements OnInit {
  accountBalance: AccountBalance;
  contacts: Contact[];
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
  accounts: any;
  address = this.authServ.currAddress;

  bytes = new Uint8Array(193);
  typeCoin = 'ZBC';
  typeFee = 'ZBC';

  saveAddress: boolean = false;
  customFee: boolean = false;

  constructor(
    private accountServ: AccountService,
    private transactionServ: TransactionService,
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private currencyServ: CurrencyRateService,
    private contactServ: ContactService,
    private translate: TranslateService,
    public dialog: MatDialog
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

    this.account = authServ.getCurrAccount();
  }

  ngOnInit() {
    this.accountServ.getAccountBalance().then((data: AccountBalanceList) => {
      this.accountBalance = data.accountbalance;
    });
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

    this.accounts = this.accountServ.getAllAccount();
  }

  openAccountList() {
    this.accountRefDialog = this.dialog.open(this.accountDialog, {
      width: '360px',
    });
  }

  onSwitchAccount(account: SavedAccount) {
    this.authServ.switchAccount(account);
    this.account = this.authServ.getCurrAccount();
    this.address = this.authServ.currAddress;
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
  }

  onOpenDialogDetailSendMoney() {
    const total = this.amountForm.value + this.feeForm.value;
    if (parseInt(this.accountBalance.spendablebalance) / 1e8 >= total) {
      this.sendMoneyRefDialog = this.dialog.open(this.popupDetailSendMoney, {
        width: '400px',
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

      const pin = this.pinField.value;
      const encSeed = localStorage.getItem('ENC_MASTER_SEED');

      // give some delay so that the dom have time to render the spinner
      setTimeout(() => {
        const key = CryptoJS.PBKDF2(pin, 'salt', {
          keySize: 8,
          iterations: 10000,
        }).toString();

        try {
          const seed = CryptoJS.AES.decrypt(encSeed, key).toString(
            CryptoJS.enc.Utf8
          );
          if (!seed) throw 'not match';

          this.pinRefDialog.close(true);
          this.sendMoneyRefDialog.close();
        } catch (e) {
          this.formConfirmPin.setErrors({ invalid: true });
        } finally {
          this.isConfirmPinLoading = false;
        }
      }, 50);
    }
  }

  closeDialog() {
    this.sendMoneyRefDialog.close();
  }

  async onSendMoney() {
    if (this.formSend.valid) {
      this.isFormSendLoading = true;

      const account = this.account;
      const seed = Buffer.from(this.authServ.currSeed, 'hex');

      this.keyringServ.calcBip32RootKeyFromSeed(coin, seed);
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(
        coin,
        account.path
      );

      const sender = Buffer.from(this.authServ.currAddress, 'utf-8');
      const recepient = Buffer.from(this.recipientForm.value, 'utf-8');
      const amount = this.amountForm.value * 1e8;
      const fee = this.feeForm.value * 1e8;
      const timestamp = Math.trunc(Date.now() / 1000);

      let bytes = new BytesMaker(129);
      // transaction type
      bytes.write4bytes(1);
      // version
      bytes.write1Byte(1);
      // timestamp
      bytes.write8Bytes(timestamp);
      // sender address length
      bytes.write4bytes(44);
      // sender address
      bytes.write44Bytes(sender);
      // recepient address length
      bytes.write4bytes(44);
      // recepient address
      bytes.write44Bytes(recepient);
      // tx fee
      bytes.write8Bytes(fee);
      // tx body length
      bytes.write4bytes(8);
      // tx body (amount)
      bytes.write8Bytes(amount);

      let signature = childSeed.sign(bytes.value);
      let bytesWithSign = new BytesMaker(197);

      // copy to new bytes
      bytesWithSign.write(bytes.value, 129);
      // set signature type
      bytesWithSign.write4bytes(0);
      // set signature
      bytesWithSign.write(signature, 64);

      this.transactionServ.postTransaction(bytesWithSign.value).then(
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

          if (this.saveAddress) {
            const newContact = {
              alias: this.aliasField.value,
              address: this.recipientForm.value,
            };
            this.contacts.push(newContact);
            this.contactServ.addContact(newContact);
          }

          this.formSend.reset();
          Object.keys(this.formSend.controls).forEach(key => {
            this.formSend.controls[key].setErrors(null);
          });
          this.closeDialog();
        },
        err => console.log(err)
      );
    }
  }
}
