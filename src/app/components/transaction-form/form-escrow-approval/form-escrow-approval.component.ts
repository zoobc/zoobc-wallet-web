import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { EscrowApprovalInterface, escrowBuilder } from 'zoobc-sdk';
import { escrowForm, escrowMap } from '../form-escrow/form-escrow.component';
import { SavedAccount } from 'src/app/services/auth.service';

@Component({
  selector: 'form-escrow-approval',
  templateUrl: './form-escrow-approval.component.html',
  styleUrls: ['./form-escrow-approval.component.scss'],
})
export class FormEscrowApprovalComponent {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  @Input() multisig: boolean = false;

  minFee = environment.fee;

  constructor() {}
}

export const escrowApprovalMap = {
  fee: 'fee',
  transactionId: 'transactionId',
  sender: 'sender',
  approvalCode: 'approvalCode',
  ...escrowMap,
};

export function createEscrowApprovalForm(): FormGroup {
  return new FormGroup({
    sender: new FormControl('', Validators.required),
    fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
    transactionId: new FormControl('', Validators.required),
    approvalCode: new FormControl(0, Validators.required),
    ...escrowForm,
  });
}

export function createEscrowApprovalBytes(form: any): Buffer {
  const { approvalCode, fee, transactionId, sender } = form;
  const data: EscrowApprovalInterface = {
    fee,
    approvalCode,
    approvalAddress: sender,
    transactionId,
  };
  return escrowBuilder(data);
}
