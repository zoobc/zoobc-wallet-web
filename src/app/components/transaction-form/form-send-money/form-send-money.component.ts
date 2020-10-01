import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { Contact } from 'src/app/services/contact.service';
import { Currency } from 'src/app/services/currency-rate.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-send-money',
  templateUrl: './form-send-money.component.html',
  styleUrls: ['./form-send-money.component.scss'],
})
export class FormSendMoneyComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  // @Input() contact?: Contact;
  @Input() currencyRate: Currency;
  @Input() showSaveAddressBtn: boolean = false;
  @Input() saveAddress: boolean = false;
  @Input() saveAddressFeature: boolean = false;
  // @Output() switchAccount?: EventEmitter<SavedAccount> = new EventEmitter();
  // @Output() isAddressInContacts?: EventEmitter<boolean> = new EventEmitter();
  // @Output() toggleSaveAddress?: EventEmitter<boolean> = new EventEmitter();
  account: SavedAccount;
  chooseSender: boolean = true;

  contacts: Contact[];
  contact: Contact;
  filteredContacts: Observable<Contact[]>;

  constructor(private authServ: AuthService) {}

  // onSwitchAccount(account: SavedAccount) {
  //   this.account = account;
  //   this.switchAccount.emit(account);
  // }
  // onToggleSaveAddress() {
  //   this.toggleSaveAddress.emit(true);
  // }

  ngOnInit() {
    if (this.inputMap.sender) this.chooseSender = false;

    this.contacts = this.contactServ.getList() || [];

    this.filteredContacts = this.recipientForm.valueChanges.pipe(
      startWith(''),
      map(value => this.filterContacts(value))
    );

    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      this.feeFormCurr.patchValue(minCurrency);
      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
      this.amountCurrencyForm.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);
    this.getAccounts();
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
  }

  filterContacts(value: string): Contact[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.contacts.filter((contact: Contact) => contact.name.toLowerCase().includes(filterValue));
    } else if (value == '') return this.contacts;
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
}
