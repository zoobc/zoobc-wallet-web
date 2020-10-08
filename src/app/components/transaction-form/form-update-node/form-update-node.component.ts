import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isZBCAddressValid } from 'zoobc-sdk';

@Component({
  selector: 'app-form-update-node',
  templateUrl: './form-update-node.component.html',
})
export class FormUpdateNodeComponent {
  @Input() group: FormGroup;
  @Input() inputMap: any;

  minFee = environment.fee;

  onChangeNodePublicKey() {
    let isValid = isZBCAddressValid(this.group.get(this.inputMap.nodePublicKey).value, 'ZNK');
    if (!isValid) this.group.get(this.inputMap.nodePublicKey).setErrors({ invalidAddress: true });
  }
}
