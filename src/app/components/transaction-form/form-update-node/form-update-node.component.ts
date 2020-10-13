import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isZBCAddressValid } from 'zoobc-sdk';
import { escrowForm, escrowMap } from '../form-escrow/form-escrow.component';

@Component({
  selector: 'form-update-node',
  templateUrl: './form-update-node.component.html',
})
export class FormUpdateNodeComponent {
  @Input() group: FormGroup;
  @Input() inputMap: any;

  minFee = environment.fee;

  onChangeNodePublicKey() {
    let isValid = isZBCAddressValid(this.group.get(this.inputMap.nodePublicKey).value);
    if (!isValid) this.group.get(this.inputMap.nodePublicKey).setErrors({ invalidAddress: true });
  }
}

export const updateNodeMap = {
  ipAddress: 'ipAddress',
  lockedAmount: 'lockedAmount',
  fee: 'fee',
  nodePublicKey: 'nodePublicKey',
  ...escrowMap,
};

export function createUpdateNodeForm() {
  return new FormGroup({
    ipAddress: new FormControl('', [Validators.required, Validators.pattern('^https?://+[\\w.-]+:\\d+$')]),
    lockedAmount: new FormControl('', [Validators.required, Validators.min(1 / 1e8)]),
    fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
    nodePublicKey: new FormControl('', Validators.required),
    ...escrowForm,
  });
}
