import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SavedAccount } from 'src/app/services/auth.service';
import { Currency } from 'src/app/services/currency-rate.service';

@Component({
  selector: 'form-setup-account-dataset',
  templateUrl: './form-setup-account-dataset.component.html',
})
export class FormSetupAccountDatasetComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() formValue: any;
  @Input() currencyRate: Currency;
  @Input() isSetupOther: boolean = false;
  @Output() enableSetupOther?: EventEmitter<boolean> = new EventEmitter();
  @Output() switchAccount?: EventEmitter<SavedAccount> = new EventEmitter();
  account: SavedAccount;
  chooseSender: boolean = true;

  constructor() {}

  ngOnInit() {
    if (this.formValue.sender) this.chooseSender = false;
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.switchAccount.emit(account);
  }

  onToggleEnableSetupOther() {
    this.enableSetupOther.emit(true);
  }
}
