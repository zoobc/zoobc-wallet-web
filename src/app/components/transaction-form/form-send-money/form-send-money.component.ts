import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SavedAccount } from 'src/app/services/auth.service';
import { Contact } from 'src/app/services/contact.service';
import { Currency } from 'src/app/services/currency-rate.service';

@Component({
  selector: 'app-form-send-money',
  templateUrl: './form-send-money.component.html',
  styleUrls: ['./form-send-money.component.scss'],
})
export class FormSendMoneyComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  @Input() contact?: Contact;
  @Input() currencyRate: Currency;
  @Input() showSaveAddressBtn: boolean = false;
  @Input() saveAddress: boolean = false;
  @Input() saveAddressFeature: boolean = false;
  @Output() switchAccount?: EventEmitter<SavedAccount> = new EventEmitter();
  @Output() isAddressInContacts?: EventEmitter<boolean> = new EventEmitter();
  @Output() toggleSaveAddress?: EventEmitter<boolean> = new EventEmitter();
  account: SavedAccount;
  chooseSender: boolean = true;

  constructor() {}

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.switchAccount.emit(account);
  }
  onToggleSaveAddress() {
    this.toggleSaveAddress.emit(true);
  }

  ngOnInit() {
    if (this.inputMap.sender) this.chooseSender = false;
  }

  checkAddressInContacts() {
    this.isAddressInContacts.emit(true);
  }
}
