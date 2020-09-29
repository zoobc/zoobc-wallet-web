import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import { environment } from 'src/environments/environment';
import { truncate } from 'src/helpers/utils';
import { isZBCAddressValid } from 'zoobc-sdk';

@Component({
  selector: 'app-form-remove-node',
  templateUrl: './form-remove-node.component.html',
})
export class FormRemoveNodeComponent implements OnInit, OnDestroy {
  @Input() group: FormGroup;
  @Input() inputMap: any;

  minFee = environment.fee;
  currencyRate: Currency;
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
