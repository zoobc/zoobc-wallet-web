import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SavedAccount } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { SetupDatasetInterface, setupDatasetBuilder } from 'zoobc-sdk';
import { escrowForm } from '../form-escrow/form-escrow.component';

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

export const setupDatasetMap = {
  sender: 'sender',
  property: 'property',
  value: 'value',
  recipientAddress: 'recipientAddress',
  fee: 'fee',
  ...escrowForm,
};

export function createSetupDatasetForm(): FormGroup {
  return new FormGroup({
    sender: new FormControl('', Validators.required),
    property: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required]),
    recipientAddress: new FormControl('', Validators.required),
    fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
    ...escrowForm,
  });
}

export function createSetupDatasetBytes(form: any): Buffer {
  const { sender, fee, recipientAddress, property, value } = form;
  const data: SetupDatasetInterface = {
    property,
    value,
    setterAccountAddress: sender,
    recipientAccountAddress: recipientAddress,
    fee,
  };
  return setupDatasetBuilder(data);
}
