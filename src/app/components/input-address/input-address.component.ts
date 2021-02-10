import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { isZBCAddressValid } from 'zbc-sdk';
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

  value: string;
  tempVal: string[];
  account: SavedAccount;
  accounts: SavedAccount[];

  private _onChange = (value: any) => {};
  private _onTouched = (value: any) => {};
  disabled: boolean;

  constructor(private authServ: AuthService) {}

  ngOnInit() {
    // this.getAccounts();
  }

  writeValue(value: any) {
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

  onChange(value: any) {
    this._onChange(value);
    this._onTouched(value);
  }

  onOptionClick(address: any) {
    this._onChange(address);
  }

  // filterContacts(value: string): Contact[] {
  //   if (value) {
  //     const filterValue = value.toLowerCase();
  //     return this.contacts.filter((contact: Contact) =>
  //       contact.alias.toLocaleLowerCase().includes(filterValue)
  //     );
  //   } else if (value == '') return this.contacts;
  // }

  // getAccounts() {
  //   this.accounts = this.authServ.getAllAccount();
  //   if (this.exceptContact)
  //     this.accounts = this.accounts.filter(acc => acc.address !== this.exceptContact.address);
  //   this.accounts.forEach(account => {
  //     const contact: Contact = {
  //       address: account.address,
  //       alias: account.name,
  //     };
  //     this.contacts.push(contact);
  //   });
  // }

  validate({ value }: FormControl) {
    let result: boolean = false;
    if (value) {
      result = isZBCAddressValid(value);
    } else {
      return null;
    }

    if (!result) {
      return { invalidAddress: true };
    }
    return null;
  }
}
