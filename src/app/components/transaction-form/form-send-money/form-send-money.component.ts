import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { Contact, ContactService } from 'src/app/services/contact.service';
import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { truncate } from 'src/helpers/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'form-send-money',
  templateUrl: './form-send-money.component.html',
  styleUrls: ['./form-send-money.component.scss'],
})
export class FormSendMoneyComponent implements OnInit, OnDestroy {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  @Input() currencyRate: Currency;
  @Input() multisig: boolean = false;

  showSaveAddressBtn: boolean = true;
  saveAddress: boolean = false;

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

  ngOnInit() {
    const recipientForm = this.group.get('recipient');
    const amountCurrencyForm = this.group.get('amountCurrency');
    const feeFormCurr = this.group.get('feeCurr');

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
}
