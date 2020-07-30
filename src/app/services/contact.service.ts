import { Injectable } from '@angular/core';

export interface Contact {
  name: string;
  address: string;
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

    const empty = { address: '', name: '' };
    return contacts.find(c => c.address == address) || empty;
  }

  add(contact: Contact): Contact[] {
    let contacts: Contact[] = JSON.parse(localStorage.getItem('CONTACT_LIST')) || [];
    contacts.push(contact);
    localStorage.setItem('CONTACT_LIST', JSON.stringify(contacts));
    return contacts;
  }

  delete(address: string): Contact[] {
    let contacts: Contact[] = JSON.parse(localStorage.getItem('CONTACT_LIST'));
    contacts = contacts.filter(contact => contact.address != address);
    localStorage.setItem('CONTACT_LIST', JSON.stringify(contacts));
    return contacts;
  }

  update(newContact: Contact, oldAddress: string): Contact[] {
    let contacts: Contact[] = JSON.parse(localStorage.getItem('CONTACT_LIST'));
    contacts = contacts.map(contact => {
      if (contact.address == oldAddress) return newContact;
      return contact;
    });
    localStorage.setItem('CONTACT_LIST', JSON.stringify(contacts));
    return contacts;
  }

  isDuplicate(address: string): boolean {
    const contacts: Contact[] = JSON.parse(localStorage.getItem('CONTACT_LIST')) || [];
    return contacts.some(c => c.address === address);
  }
}
