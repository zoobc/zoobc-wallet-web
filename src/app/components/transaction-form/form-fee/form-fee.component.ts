import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { calcMinFee } from 'src/helpers/utils';

@Component({
  selector: 'form-fee',
  templateUrl: './form-fee.component.html',
})
export class FormFeeComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() inputMap: any;

  showFee: boolean = false;
  minFee = environment.fee;

  constructor() {}

  ngOnInit() {}

  toggleAdvancedMenu() {
    this.showFee = !this.showFee;
    this.enableFieldEscrow();
    if (!this.showFee) this.disableFieldEscrow();
  }

  resetValue() {
    this.group.get(this.inputMap.fee).setValue(this.minFee);
    this.getMinimumFee();
  }

  enableFieldEscrow() {
    this.group.get(this.inputMap.fee).enable();
    this.resetValue();
  }

  disableFieldEscrow() {
    this.group.get(this.inputMap.fee).disable();
  }

  async getMinimumFee() {
    const feeForm = this.group.get('fee');
    const fee: number = calcMinFee(this.group.value);
    this.minFee = fee;

    feeForm.setValidators([Validators.required, Validators.min(fee)]);
    if (fee > feeForm.value) feeForm.patchValue(fee);
    feeForm.updateValueAndValidity();
    feeForm.markAsTouched();
  }
}
