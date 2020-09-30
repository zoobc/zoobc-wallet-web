import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { truncate } from 'src/helpers/utils';
import { Subscription } from 'rxjs';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-escrow-approval',
  templateUrl: './form-escrow-approval.component.html',
  styleUrls: ['./form-escrow-approval.component.scss'],
})
export class FormEscrowApprovalComponent implements OnInit, OnDestroy {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  @Input() prefillTxId: boolean = false;
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
}
