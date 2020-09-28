import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';
import { environment } from 'src/environments/environment';
import { isZBCAddressValid } from 'zoobc-sdk';
import { Subscription } from 'rxjs';
import { truncate } from 'src/helpers/utils';

@Component({
  selector: 'app-form-register-node',
  templateUrl: './form-register-node.component.html',
  styleUrls: ['./form-register-node.component.scss'],
})
export class FormRegisterNodeComponent implements OnInit, OnDestroy {
  @Input() group: FormGroup;
  @Input() inputMap: any;

  currencyRate: Currency;
  minFee: number = environment.fee;
  subscription: Subscription = new Subscription();

  constructor(private currencyServ: CurrencyRateService) {}

  ngOnInit() {
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      this.group.get(this.inputMap.feeCurr).patchValue(minCurrency);
      this.group.get(this.inputMap.feeCurr).setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChangeNodePublicKey() {
    let isValid = isZBCAddressValid(this.group.get(this.inputMap.nodePublicKey).value, 'ZNK');
    if (!isValid) this.group.get(this.inputMap.nodePublicKey).setErrors({ invalidAddress: true });
  }
}
