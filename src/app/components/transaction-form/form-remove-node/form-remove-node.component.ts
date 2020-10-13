import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isZBCAddressValid } from 'zoobc-sdk';
import { escrowForm, escrowMap } from '../form-escrow/form-escrow.component';

@Component({
  selector: 'form-remove-node',
  templateUrl: './form-remove-node.component.html',
})
export class FormRemoveNodeComponent {
  minFee = environment.fee;
  @Input() group: FormGroup;
  @Input() inputMap: any;

  constructor() {}

  onChangeNodePublicKey() {
    let isValid = isZBCAddressValid(this.group.get(this.inputMap.nodePublicKey).value);
    if (!isValid) this.group.get(this.inputMap.nodePublicKey).setErrors({ invalidAddress: true });
  }
}

export const removeNodeMap = {
  fee: 'fee',
  nodePublicKey: 'nodePublicKey',
  ...escrowMap,
};

export function createRemoveNodeForm() {
  return new FormGroup({
    fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
    nodePublicKey: new FormControl('', Validators.required),
    ...escrowForm,
  });
}
