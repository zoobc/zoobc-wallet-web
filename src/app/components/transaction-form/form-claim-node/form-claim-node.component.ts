import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isZBCAddressValid } from 'zoobc-sdk';

@Component({
  selector: 'app-form-claim-node',
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
