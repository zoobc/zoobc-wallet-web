import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { RemoveDatasetInterface, removeDatasetBuilder } from 'zoobc-sdk';
import { escrowMap, escrowForm } from '../form-escrow/form-escrow.component';

@Component({
  selector: 'form-remove-account-dataset',
  templateUrl: './form-remove-account-dataset.component.html',
})
export class FormRemoveAccountDatasetComponent implements OnChanges {
  @Input() group: FormGroup;
  @Input() formValue: any;
  @Input() removeOther?: boolean = false;
  @Output() switchAccount?: EventEmitter<SavedAccount> = new EventEmitter();
  account: SavedAccount;
  readOnly: boolean = true;

  constructor(private authServ: AuthService) {
    this.account = this.authServ.getCurrAccount();
  }

  ngOnInit() {}

  ngOnChanges() {
    this.formValue = this.formValue;
    const isSetterAddressSame = this.group.get(this.formValue.sender).value == this.account.address;
    if (!isSetterAddressSame) this.readOnly = false;
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.switchAccount.emit(account);
  }
}

export const removeDatasetMap = {
  sender: 'sender',
  property: 'property',
  value: 'value',
  recipientAddress: 'recipientAddress',
  fee: 'fee',
  ...escrowMap,
};

export function createRemoveDatasetForm(): FormGroup {
  return new FormGroup({
    sender: new FormControl('', Validators.required),
    property: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required]),
    recipientAddress: new FormControl('', Validators.required),
    fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
    ...escrowForm,
  });
}

export function createRemoveSetupDatasetBytes(form: any): Buffer {
  const { sender, fee, recipientAddress, property, value } = form;
  const data: RemoveDatasetInterface = {
    property,
    value,
    setterAccountAddress: sender,
    recipientAccountAddress: recipientAddress,
    fee,
  };
  return removeDatasetBuilder(data);
}
