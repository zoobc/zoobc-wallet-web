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
