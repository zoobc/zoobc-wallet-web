import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isZBCAddressValid } from 'zoobc-sdk';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-register-node',
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
