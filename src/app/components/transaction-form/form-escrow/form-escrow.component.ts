import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import zoobc, { HostInfoResponse, SendMoneyInterface } from 'zoobc-sdk';
import { truncate, calcMinFee } from 'src/helpers/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'form-escrow',
  templateUrl: './form-escrow.component.html',
  styleUrls: ['./form-escrow.component.scss'],
})
export class FormEscrowComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  // @Output() changeTimeOut: EventEmitter<boolean> = new EventEmitter();
  currencyRate: Currency;

  showEscrow: boolean = false;
  blockHeight: number;

  minFee: number = environment.fee;

  constructor(private currencyServ: CurrencyRateService) {}

  ngOnInit() {
    this.disableFieldEscrow();

    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });
  }

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
    this.group.get(this.inputMap.approverCommissionCurr).enable();
    this.group.get(this.inputMap.typeCommission).enable();
    this.group.get(this.inputMap.instruction).enable();
    this.group.get(this.inputMap.timeout).enable();
    this.getBlockHeight();
  }

  disableFieldEscrow() {
    this.group.get(this.inputMap.addressApprover).disable();
    this.group.get(this.inputMap.approverCommission).disable();
    this.group.get(this.inputMap.approverCommissionCurr).disable();
    this.group.get(this.inputMap.typeCommission).disable();
    this.group.get(this.inputMap.instruction).disable();
    this.group.get(this.inputMap.timeout).disable();
  }

  async getMinimumFee() {
    const amountForm = this.group.get('amount');
    const feeForm = this.group.get('fee');
    const approverCommissionField = this.group.get('approverCommission');
    const addressApproverField = this.group.get('addressApprover');
    const senderForm = this.group.get('sender');
    const recipientForm = this.group.get('recipient');
    const timeoutField = this.group.get('timeout');
    const instructionField = this.group.get('instruction');
    const amountCurrencyForm = this.group.get('amountCurrency');
    const feeFormCurr = this.group.get('feeCurr');

    let data: SendMoneyInterface = {
      sender: senderForm.value,
      recipient: recipientForm.value,
      fee: feeForm.value,
      amount: amountForm.value,
      approverAddress: addressApproverField.value,
      commission: approverCommissionField.value,
      timeout: timeoutField.value,
      instruction: instructionField.value,
    };

    const fee: number = calcMinFee(data);
    this.minFee = fee;

    feeForm.setValidators([Validators.required, Validators.min(fee)]);
    if (fee > feeForm.value) feeForm.patchValue(fee);
    const feeCurrency = truncate(fee * this.currencyRate.value, 8);
    feeFormCurr.setValidators([Validators.required, Validators.min(feeCurrency)]);
    feeFormCurr.patchValue(feeCurrency);
    amountCurrencyForm.setValidators([Validators.required, Validators.min(feeCurrency)]);
    feeForm.updateValueAndValidity();
    feeFormCurr.updateValueAndValidity();
    feeForm.markAsTouched();
    feeFormCurr.markAsTouched();
  }

  onChangeTimeOut() {
    this.getMinimumFee();
  }
}
