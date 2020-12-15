import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { Contact, ContactService } from 'src/app/services/contact.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { escrowForm, escrowMap } from '../form-escrow/form-escrow.component';
import { sendMoneyBuilder, SendMoneyInterface } from 'zoobc-sdk';

@Component({
  selector: 'form-send-money',
  templateUrl: './form-send-money.component.html',
})
export class FormSendMoneyComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  @Input() multisig: boolean = false;

  showSaveAddressBtn: boolean = true;
  saveAddress: boolean = false;

  contacts: Contact[];
  contact: Contact;
  filteredContacts: Observable<Contact[]>;

  minFee = environment.fee;

  account: SavedAccount;
  accounts: SavedAccount[];

  accountSelectorType = 'normal';

  constructor(private authServ: AuthService, private contactServ: ContactService) {}

  ngOnInit() {
    this.group.get('alias').disable();
    const recipientForm = this.group.get('recipient');

    this.contacts = this.contactServ.getList() || [];

    this.filteredContacts = recipientForm.valueChanges.pipe(
      startWith(''),
      map(value => this.filterContacts(value))
    );
    this.getAccounts();
    if (recipientForm.value) this.isAddressInContacts();

    this.accountSelectorType = this.authServ.getCurrAccount().type;
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
    this.group.get('sender').patchValue(account.address.value);
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
      if (c.address.value == recipientForm.value) {
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

export const sendMoneyMap = {
  sender: 'sender',
  recipient: 'recipient',
  alias: 'alias',
  amount: 'amount',
  fee: 'fee',
  ...escrowMap,
};

export function createSendMoneyForm(): FormGroup {
  return new FormGroup({
    sender: new FormControl('', Validators.required),
    recipient: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.min(1 / 1e8)]),
    alias: new FormControl('', Validators.required),
    fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
    ...escrowForm(),
  });
}

export function createSendMoneyBytes(form: any): Buffer {
  const { sender, fee, amount, recipient } = form;
  const data: SendMoneyInterface = {
    sender: { value: sender, type: 0 },
    fee,
    amount,
    recipient: { value: recipient, type: 0 },
  };
  return sendMoneyBuilder(data);
}
