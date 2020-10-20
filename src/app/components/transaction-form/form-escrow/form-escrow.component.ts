import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import zoobc, { HostInfoResponse } from 'zoobc-sdk';
import { calcMinFee } from 'src/helpers/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'form-escrow',
  templateUrl: './form-escrow.component.html',
})
export class FormEscrowComponent {
  @Input() group: FormGroup;
  @Input() inputMap: any;

  showEscrow: boolean = false;
  blockHeight: number;

  minFee: number = environment.fee;

  constructor() {}

  getBlockHeight() {
    zoobc.Host.getInfo()
      .then((res: HostInfoResponse) => {
        res.chainstatusesList.filter(chain => {
          if (chain.chaintype === 0) this.blockHeight = chain.height;
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  toggleAdvancedMenu() {
    this.showEscrow = !this.showEscrow;
    this.enableFieldEscrow();
    if (!this.showEscrow) this.disableFieldEscrow();
  }

  enableFieldEscrow() {
    this.group.get(this.inputMap.addressApprover).enable();
    this.group.get(this.inputMap.approverCommission).enable();
    this.group.get(this.inputMap.instruction).enable();
    this.group.get(this.inputMap.timeout).enable();
    this.getBlockHeight();
  }

  disableFieldEscrow() {
    this.group.get(this.inputMap.addressApprover).disable();
    this.group.get(this.inputMap.approverCommission).disable();
    this.group.get(this.inputMap.instruction).disable();
    this.group.get(this.inputMap.timeout).disable();
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

  onChangeTimeOut() {
    this.getMinimumFee();
  }
}

export const escrowMap = {
  addressApprover: 'addressApprover',
  typeCommission: 'typeCommission',
  approverCommission: 'approverCommission',
  timeout: 'timeout',
  instruction: 'instruction',
};

export const escrowForm = {
  addressApprover: new FormControl({ value: '', disabled: true }, Validators.required),
  approverCommission: new FormControl({ value: '', disabled: true }, [
    Validators.required,
    Validators.min(1 / 1e8),
  ]),
  timeout: new FormControl({ value: '', disabled: true }, [
    Validators.required,
    Validators.min(1),
    Validators.max(720),
  ]),
  instruction: new FormControl({ value: '', disabled: true }, Validators.required),
};
