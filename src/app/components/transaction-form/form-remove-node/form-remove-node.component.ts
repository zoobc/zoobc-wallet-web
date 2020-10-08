import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isZBCAddressValid } from 'zoobc-sdk';

@Component({
  selector: 'app-form-remove-node',
  templateUrl: './form-remove-node.component.html',
})
export class FormRemoveNodeComponent {
  @Input() group: FormGroup;
  @Input() inputMap: any;

  constructor() {}

  onChangeNodePublicKey() {
    let isValid = isZBCAddressValid(this.group.get(this.inputMap.nodePublicKey).value, 'ZNK');
    if (!isValid) this.group.get(this.inputMap.nodePublicKey).setErrors({ invalidAddress: true });
  }
}
