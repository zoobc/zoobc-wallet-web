import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SetupDatasetInterface, setupDatasetBuilder } from 'zbc-sdk';
import { escrowForm, escrowMap } from '../form-escrow/form-escrow.component';

@Component({
  selector: 'form-setup-account-dataset',
  templateUrl: './form-setup-account-dataset.component.html',
})
export class FormSetupAccountDatasetComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  @Input() multisig: boolean = false;

  isSetupOther: boolean = false;

  constructor() {}

  ngOnInit() {
    this.setDefaultRecipient();
  }

  onToggleEnableSetupOther() {
    this.isSetupOther = !this.isSetupOther;
    if (!this.isSetupOther) this.setDefaultRecipient();
  }

  setDefaultRecipient() {
    const sender = this.group.get('sender').value;
    const recipientField = this.group.get('recipient');
    recipientField.patchValue(sender);
  }
}

export const setupDatasetMap = {
  sender: 'sender',
  property: 'property',
  value: 'value',
  recipient: 'recipient',
  fee: 'fee',
  ...escrowMap,
};

export function createSetupDatasetForm(): FormGroup {
  return new FormGroup({
    sender: new FormControl('', Validators.required),
    property: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required]),
    recipient: new FormControl('', Validators.required),
    fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
    ...escrowForm(),
  });
}

export function createSetupDatasetBytes(form: any): Buffer {
  const { sender, fee, recipient, property, value } = form;
  const data: SetupDatasetInterface = {
    property,
    value,
    setterAccountAddress: { value: sender, type: 0 },
    recipientAccountAddress: { value: recipient, type: 0 },
    fee,
  };
  return setupDatasetBuilder(data);
}
