import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-escrow-approval',
  templateUrl: './form-escrow-approval.component.html',
  styleUrls: ['./form-escrow-approval.component.scss'],
})
export class FormEscrowApprovalComponent {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  @Input() prefillTxId: boolean = false;

  minFee = environment.fee;

  constructor() {}
}
