import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isZBCAddressValid } from 'zoobc-sdk';

@Component({
  selector: 'app-form-remove-node',
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
