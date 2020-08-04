import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
import { Contact, ContactService } from 'src/app/services/contact.service';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { isZBCAddressValid } from 'zoobc-sdk';
@Component({
  selector: 'input-address',
  templateUrl: './input-address.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAddressComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputAddressComponent),
      multi: true,
    },
  ],
})
export class InputAddressComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string;
  @Input() label: string;
  @Input() classList: string;
  @Input() readonly: boolean = false;
  @Input() exceptContact: SavedAccount;
  @Output() change = new EventEmitter();

  value: string;
  tempVal: string[];
  contacts: Contact[];
  contact: Contact;
  account: SavedAccount;
  accounts: SavedAccount[];
  filteredContacts: Contact[];

  private _onChange = (value: any) => {};
  private _onTouched = (value: any) => {};
  disabled: boolean;

  constructor(private contactServ: ContactService, private authServ: AuthService) {}

  ngOnInit() {
    this.contacts = this.contactServ.getList() || [];
    this.getAccounts();
    this.filteredContacts = this.contacts;
  }

  writeValue(value: string) {
    this.value = value ? value : '';
  }

  registerOnChange(fn: any) {
    this._onChange = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  onChange(value: string) {
    if (value != this.value) {
      this.filteredContacts = this.filterContacts(value);
      this._onChange(value);
      this._onTouched(value);
      this.change.emit(value);
    }
    this.value = value;
  }

  onOptionClick(address: string) {
    this._onChange(address);
  }

  filterContacts(value: string): Contact[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.contacts.filter((contact: Contact) =>
        contact.name.toLocaleLowerCase().includes(filterValue)
      );
    } else if (value == '') return this.contacts;
  }

  getAccounts() {
    this.accounts = this.authServ.getAllAccount();
    if (this.exceptContact)
      this.accounts = this.accounts.filter(acc => acc.address !== this.exceptContact.address);
    this.accounts.forEach(account => {
      const contact: Contact = {
        address: account.address,
        name: account.name,
      };
      this.contacts.push(contact);
    });
  }

  validate({ value }: FormControl) {
    let result: boolean = false;
    if (value) result = isZBCAddressValid(value);
    else return null;

    if (!result) return { invalidAddress: true };
    return null;
  }
}
