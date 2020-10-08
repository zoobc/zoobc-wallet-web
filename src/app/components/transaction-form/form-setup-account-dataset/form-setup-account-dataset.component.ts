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
  @Input() isSetupOther: boolean = false;
  @Output() enableSetupOther?: EventEmitter<boolean> = new EventEmitter();
  @Output() switchAccount?: EventEmitter<SavedAccount> = new EventEmitter();
  account: SavedAccount;
  prefillSender: boolean = false;

  constructor() {}

  ngOnInit() {
    if (this.group.get(this.formValue.sender).value) this.prefillSender = true;
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.switchAccount.emit(account);
  }

  onToggleEnableSetupOther() {
    this.enableSetupOther.emit(true);
  }
}
