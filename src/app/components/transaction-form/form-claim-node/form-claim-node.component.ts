import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isZBCAddressValid } from 'zoobc-sdk';
import { escrowForm, escrowMap } from '../form-escrow/form-escrow.component';

@Component({
  selector: 'form-claim-node',
  templateUrl: './form-claim-node.component.html',
})
export class FormClaimNodeComponent {
  @Input() group: FormGroup;
  @Input() inputMap: any;

  minFee: number = environment.fee;

  constructor() {}

  onChangeNodePublicKey() {
    let isValid = isZBCAddressValid(this.group.get(this.inputMap.nodePublicKey).value);
    if (!isValid) this.group.get(this.inputMap.nodePublicKey).setErrors({ invalidAddress: true });
  }
}

export const claimNodeMap = {
  fee: 'fee',
  nodePublicKey: 'nodePublicKey',
  ipAddress: 'ipAddress',
  ...escrowMap,
};

export function createClaimNodeForm() {
  return new FormGroup({
    fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
    nodePublicKey: new FormControl('', Validators.required),
    ipAddress: new FormControl('', [Validators.required, Validators.pattern('^https?://+[\\w.-]+:\\d+$')]),
    ...escrowForm,
  });
}
