// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

//     2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
// contact us at roberto.capodieci[at]blockchainzoo.com
// and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
import { Contact, ContactService } from 'src/app/services/contact.service';
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
  @Input() label: string = '';
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

  onChange(address: string) {
    if (address != this.value) {
      this.filteredContacts = this.filterContacts(address);
      this._onChange(address);
      this._onTouched(address);
      this.change.emit(address);
    }
    this.value = address;
  }

  onOptionClick(address: string) {
    this._onChange(address);
  }

  filterContacts(address: string): Contact[] {
    if (address) {
      const filterValue = address.toLowerCase();
      return this.contacts.filter((contact: Contact) =>
        contact.name.toLocaleLowerCase().includes(filterValue)
      );
    } else if (address == '') return this.contacts;
  }

  getAccounts() {
    this.accounts = this.authServ.getAllAccount();
    if (this.exceptContact)
      this.accounts = this.accounts.filter(acc => acc.address.value !== this.exceptContact.address.value);
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
    if (value) result = isZBCAddressValid(value, 'ZBC');
    else return null;

    if (!result) return { invalidAddress: true };
    return null;
  }
}
