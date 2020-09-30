import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Currency } from 'src/app/services/currency-rate.service';

@Component({
  selector: 'form-remove-account-dataset',
  templateUrl: './form-remove-account-dataset.component.html',
  styleUrls: ['./form-remove-account-dataset.component.scss'],
})
export class FormRemoveAccountDatasetComponent implements OnChanges {
  @Input() group: FormGroup;
  @Input() formValue: any;
  @Input() currencyRate: Currency;
  @Input() readOnly?: boolean = false;
  @Input() removeOther?: boolean = false;
  @Output() switchAccount?: EventEmitter<SavedAccount> = new EventEmitter();
  account: SavedAccount;

  constructor(private authServ: AuthService) {
    this.account = this.authServ.getCurrAccount();
  }

  ngOnInit() {}

  ngOnChanges() {
    this.formValue = this.formValue;
    const isSetterAddressSame = this.formValue.sender == this.account.address;
    if (!isSetterAddressSame) this.readOnly = false;
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.switchAccount.emit(account);
  }
}
