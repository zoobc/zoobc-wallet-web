import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isZBCAddressValid } from 'zoobc-sdk';
import { Subscription } from 'rxjs';
import { escrowForm, escrowMap } from '../form-escrow/form-escrow.component';

@Component({
  selector: 'form-register-node',
  templateUrl: './form-register-node.component.html',
})
export class FormRegisterNodeComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() inputMap: any;

  minFee: number = environment.fee;
  subscription: Subscription = new Subscription();

  constructor() {}

  ngOnInit() {}

  onChangeNodePublicKey() {
    let isValid = isZBCAddressValid(this.group.get(this.inputMap.nodePublicKey).value, 'ZNK');
    if (!isValid) this.group.get(this.inputMap.nodePublicKey).setErrors({ invalidAddress: true });
  }
}

export const registerNodeMap = {
  ipAddress: 'ipAddress',
  lockedBalance: 'lockedBalance',
  fee: 'fee',
  nodePublicKey: 'nodePublicKey',
  ...escrowMap,
};

export function createRegisterNodeForm() {
  return new FormGroup({
    ipAddress: new FormControl('', [Validators.required, Validators.pattern('^https?://+[\\w.-]+:\\d+$')]),
    lockedBalance: new FormControl('', [Validators.required, Validators.min(1 / 1e8)]),
    fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
    nodePublicKey: new FormControl('', Validators.required),
    ...escrowForm(),
  });
}
