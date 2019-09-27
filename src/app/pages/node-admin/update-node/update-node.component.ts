import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PoownService } from 'src/app/services/poown.service';

@Component({
  selector: 'app-update-node',
  templateUrl: './update-node.component.html',
  styleUrls: ['./update-node.component.scss'],
})
export class UpdateNodeComponent implements OnInit {
  formUpdateNode: FormGroup;
  ownerForm = new FormControl('', Validators.required);
  ipAddressForm = new FormControl('', Validators.required);
  lockedAmountForm = new FormControl('', Validators.required);
  feeForm = new FormControl('', Validators.required);
  nodePublicKeyForm = new FormControl('', Validators.required);

  poown: any;

  constructor(private poownServ: PoownService) {
    this.formUpdateNode = new FormGroup({
      owner: this.ownerForm,
      ipAddress: this.ipAddressForm,
      lockedAmount: this.lockedAmountForm,
      fee: this.feeForm,
      nodePublicKey: this.nodePublicKeyForm,
    });
  }

  ngOnInit() {
    this.poownServ.get().then(res => {
      console.log(res);

      this.poown = res;
      if (res) {
        // this.onRegisterNode();
      }
    });
    // this.nodeServ.getRegisteredNode().then(res => {});
  }

  onUpdateNode() {}
}
