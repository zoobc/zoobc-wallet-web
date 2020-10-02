import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { Contact, ContactService } from 'src/app/services/contact.service';
import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { calcMinFee, truncate } from 'src/helpers/utils';
import { environment } from 'src/environments/environment';
import { SendMoneyInterface } from 'zoobc-sdk';

@Component({
  selector: 'app-form-send-money',
  templateUrl: './form-send-money.component.html',
  styleUrls: ['./form-send-money.component.scss'],
})
export class FormSendMoneyComponent implements OnInit, OnDestroy {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  // @Input() contact?: Contact;
  @Input() currencyRate: Currency;
  @Input() showSaveAddressBtn: boolean = false;
  @Input() saveAddress: boolean = false;
  @Input() saveAddressFeature: boolean = false;
  @Input() multisig: boolean = false;
  // @Output() switchAccount?: EventEmitter<SavedAccount> = new EventEmitter();
  // @Output() isAddressInContacts?: EventEmitter<boolean> = new EventEmitter();
  // @Output() toggleSaveAddress?: EventEmitter<boolean> = new EventEmitter();

  chooseSender: boolean = true;

  contacts: Contact[];
  contact: Contact;
  filteredContacts: Observable<Contact[]>;

  minFee = environment.fee;

  account: SavedAccount;
  accounts: SavedAccount[];

  subscription: Subscription = new Subscription();

  constructor(
    private authServ: AuthService,
    private contactServ: ContactService,
    private currencyServ: CurrencyRateService
  ) {}

  // onSwitchAccount(account: SavedAccount) {
  //   this.account = account;
  //   this.switchAccount.emit(account);
  // }
  // onToggleSaveAddress() {
  //   this.toggleSaveAddress.emit(true);
  // }

  ngOnInit() {
    const amountForm = this.group.get('amount');
    const feeForm = this.group.get('fee');
    // const approverCommissionField = this.group.get('approverCommission');
    // const addressApproverField = this.group.get('addressApprover');
    const recipientForm = this.group.get('recipient');
    // const timeoutField = this.group.get('timeout');
    // const instructionField = this.group.get('instruction');
    const amountCurrencyForm = this.group.get('amountCurrency');
    const aliasField = this.group.get('alias');
    const feeFormCurr = this.group.get('feeCurr');

    if (this.inputMap.sender) this.chooseSender = false;

    this.contacts = this.contactServ.getList() || [];

    this.filteredContacts = recipientForm.valueChanges.pipe(
      startWith(''),
      map(value => this.filterContacts(value))
    );

    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      feeFormCurr.patchValue(minCurrency);
      feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
      amountCurrencyForm.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);
    this.getAccounts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // checkAddressInContacts() {
  //   this.isAddressInContacts.emit(true);
  // }

  getAccounts() {
    this.accounts = this.authServ.getAllAccount();
    this.accounts.forEach(account => {
      const contact: Contact = {
        address: account.address,
        name: account.name,
      };
      this.contacts.push(contact);
    });
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.group.get('sender').patchValue(account.address);
  }

  filterContacts(value: string): Contact[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.contacts.filter((contact: Contact) => contact.name.toLowerCase().includes(filterValue));
    } else if (value == '') return this.contacts;
  }

  isAddressInContacts() {
    const aliasField = this.group.get('alias');

    const recipientForm = this.group.get('recipient');

    const isAddressInContacts = this.contacts.some(c => {
      if (c.address == recipientForm.value) {
        this.contact = c;
        return true;
      } else return false;
    });

    if (isAddressInContacts) {
      aliasField.disable();
      this.saveAddress = false;
      this.showSaveAddressBtn = false;
    } else {
      this.showSaveAddressBtn = true;
    }
  }

  toggleSaveAddress() {
    const aliasField = this.group.get('alias');

    if (this.saveAddress) {
      aliasField.disable();
      this.saveAddress = false;
    } else {
      aliasField.enable();
      this.saveAddress = true;
    }
  }

  // async getMinimumFee() {
  //   const amountForm = this.group.get('amount');
  //   const feeForm = this.group.get('fee');
  //   const approverCommissionField = this.group.get('approverCommission');
  //   const addressApproverField = this.group.get('addressApprover');
  //   const recipientForm = this.group.get('recipient');
  //   const timeoutField = this.group.get('timeout');
  //   const instructionField = this.group.get('instruction');
  //   const amountCurrencyForm = this.group.get('amountCurr');
  //   const aliasField = this.group.get('alias');
  //   const feeFormCurr = this.group.get('feeCurr');

  //   let data: SendMoneyInterface = {
  //     sender: this.account.address,
  //     recipient: recipientForm.value,
  //     fee: feeForm.value,
  //     amount: amountForm.value,
  //     approverAddress: addressApproverField.value,
  //     commission: approverCommissionField.value,
  //     timeout: timeoutField.value,
  //     instruction: instructionField.value,
  //   };

  //   const fee: number = calcMinFee(data);
  //   this.minFee = fee;

  //   feeForm.setValidators([Validators.required, Validators.min(fee)]);
  //   if (fee > feeForm.value) feeForm.patchValue(fee);
  //   const feeCurrency = truncate(fee * this.currencyRate.value, 8);
  //   feeFormCurr.setValidators([Validators.required, Validators.min(feeCurrency)]);
  //   feeFormCurr.patchValue(feeCurrency);
  //   amountCurrencyForm.setValidators([Validators.required, Validators.min(feeCurrency)]);
  //   feeForm.updateValueAndValidity();
  //   feeFormCurr.updateValueAndValidity();
  //   feeForm.markAsTouched();
  //   feeFormCurr.markAsTouched();
  // }

  // onChangeTimeOut() {
  //   this.getMinimumFee();
  // }
}
