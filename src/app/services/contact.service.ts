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

import { Injectable } from '@angular/core';
import { Address } from 'zbc-sdk';

export interface Contact {
  name: string;
  address: Address;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor() {}

  getList(): Contact[] {
    return JSON.parse(localStorage.getItem('CONTACT_LIST'));
  }

  get(address: string): Contact {
    const contacts: Contact[] = JSON.parse(localStorage.getItem('CONTACT_LIST')) || [];

    const empty: Contact = { address: { value: '', type: 0 }, name: '' };
    return contacts.find(c => c.address.value == address) || empty;
  }

  add(contact: Contact): Contact[] {
    let contacts: Contact[] = JSON.parse(localStorage.getItem('CONTACT_LIST')) || [];
    contacts.push(contact);
    localStorage.setItem('CONTACT_LIST', JSON.stringify(contacts));
    return contacts;
  }

  delete(address: string): Contact[] {
    let contacts: Contact[] = JSON.parse(localStorage.getItem('CONTACT_LIST'));
    contacts = contacts.filter(contact => contact.address.value != address);
    localStorage.setItem('CONTACT_LIST', JSON.stringify(contacts));
    return contacts;
  }

  update(newContact: Contact, oldAddress: string): Contact[] {
    let contacts: Contact[] = JSON.parse(localStorage.getItem('CONTACT_LIST'));
    contacts = contacts.map(contact => {
      if (contact.address.value == oldAddress) return newContact;
      return contact;
    });
    localStorage.setItem('CONTACT_LIST', JSON.stringify(contacts));
    return contacts;
  }

  isDuplicate(address: string): boolean {
    const contacts: Contact[] = JSON.parse(localStorage.getItem('CONTACT_LIST')) || [];
    return contacts.some(c => c.address.value === address);
  }
}
