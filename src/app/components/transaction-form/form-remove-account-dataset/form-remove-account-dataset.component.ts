import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { RemoveDatasetInterface, removeDatasetBuilder } from 'zoobc-sdk';
import { escrowMap, escrowForm } from '../form-escrow/form-escrow.component';

@Component({
  selector: 'form-remove-account-dataset',
  templateUrl: './form-remove-account-dataset.component.html',
})
export class FormRemoveAccountDatasetComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  @Input() multisig: boolean = false;

  isSetupOther: boolean = false;

  ngOnInit() {
    this.setDefaultRecipient();
  }

  onToggleEnableSetupOther() {
    this.isSetupOther = !this.isSetupOther;
    if (!this.isSetupOther) this.setDefaultRecipient();
  }

  setDefaultRecipient() {
    const sender = this.group.get('sender').value;
    const recipientField = this.group.get('recipientAddress');
    recipientField.patchValue(sender);
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
    ...escrowForm(),
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
