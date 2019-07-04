import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AccountService } from "./services/account.service";

@Injectable({
  providedIn: "root"
})
export class AppService implements CanActivate {
  constructor(private router: Router, private accServ: AccountService) {}

  getContactList() {
    return JSON.parse(localStorage.getItem("CONTACT_LIST"));
  }

  addContact(newContact) {
    let contact = JSON.parse(localStorage.getItem("CONTACT_LIST"));
    contact = contact || [];
    contact.push(newContact);
    localStorage.setItem("CONTACT_LIST", JSON.stringify(contact));
  }

  deleteContact(address) {
    let contact = JSON.parse(localStorage.getItem("CONTACT_LIST"));

    for (let i = 0; i < contact.length; i++) {
      if (contact[i].address == address) {
        contact.splice(i, 1);
      }
    }
    localStorage.setItem("CONTACT_LIST", JSON.stringify(contact));
  }

  updateContact(oldContact, newContact) {
    let contact = JSON.parse(localStorage.getItem("CONTACT_LIST"));

    for (let i = 0; i < contact.length; i++) {
      if (contact[i].address == oldContact.address) {
        contact[i] = newContact;
      }
    }
    localStorage.setItem("CONTACT_LIST", JSON.stringify(contact));
  }

  isLoggedIn() {
    return this.accServ.currPublicKey ? true : false;
  }

  canActivate(): boolean {
    if (this.accServ.currPublicKey) return true;
    this.router.navigateByUrl("/login");
    return false;
  }
}

// Language
export const LANGUAGES = [
  {
    country: "English",
    code: "en"
  },
  {
    country: "Indonesia",
    code: "id"
  }
];
