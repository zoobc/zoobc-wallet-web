// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

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

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { Contact, ContactService } from 'src/app/services/contact.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { escrowForm, escrowMap } from '../form-escrow/form-escrow.component';
import { sendMoneyBuilder, SendMoneyInterface, TransactionType } from 'zbc-sdk';
import { MultisigService } from 'src/app/services/multisig.service';

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

  accountSelectorType: string = 'normal';

  constructor(
    private authServ: AuthService,
    private contactServ: ContactService,
    private multisigServ: MultisigService
  ) {}

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

    if (account.type == 'multisig')
      this.multisigServ.initDraft(account, TransactionType.SENDMONEYTRANSACTION);
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
