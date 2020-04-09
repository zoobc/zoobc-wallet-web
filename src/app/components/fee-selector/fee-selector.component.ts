import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContactService, Contact } from 'src/app/services/contact.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  CurrencyRateService,
  Currency,
} from 'src/app/services/currency-rate.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from 'src/environments/environment';
import { truncate, calcMinFee } from 'src/helpers/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import zoobc, { isZBCAddressValid } from 'zoobc-sdk';
import { SendMoneyInterface } from 'zoobc-sdk/types/helper/transaction-builder/send-money';

@Component({
  selector: 'fee-selector',
  templateUrl: './fee-selector.component.html',
  styleUrls: ['./fee-selector.component.scss'],
})
export class FeeSelectorComponent implements OnInit {
  subscription: Subscription = new Subscription();

  currencyRate: Currency;

  feeSlow = environment.fee;
  feeMedium = this.feeSlow * 2;
  feeFast = this.feeMedium * 2;
  activeButton: number = 2;
  kindFee: string;

  formSend: FormGroup;

  amountCurrencyForm = new FormControl('', Validators.required);
  feeForm = new FormControl(this.feeMedium, [
    Validators.required,
    Validators.min(this.feeSlow),
  ]);
  feeFormCurr = new FormControl('', Validators.required);

  typeCoin = 'ZBC';
  typeFee = 'ZBC';

  customFee: boolean = false;

  constructor(
    private currencyServ: CurrencyRateService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.formSend = new FormGroup({
      amountCurrency: this.amountCurrencyForm,
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
    });
  }

  ngOnInit() {
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      // set default fee to medium
      this.onChangeFeeField();
      // convert fee to current currency
      this.onFeeChoose(2);

      const minCurrency = truncate(this.feeSlow * rate.value, 8);

      this.feeFormCurr.setValidators([
        Validators.required,
        Validators.min(minCurrency),
      ]);
      this.amountCurrencyForm.setValidators(Validators.min(minCurrency));
    });

    this.subscription.add(subsRate);

    // this.watchEscrowField();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChangeFeeField() {
    const fee = truncate(this.feeForm.value, 8);
    const feeCurrency = fee * this.currencyRate.value;
    this.feeFormCurr.patchValue(feeCurrency);
  }

  onChangeFeeCurrencyField() {
    const fee = this.feeFormCurr.value / this.currencyRate.value;
    const feeTrunc = truncate(fee, 8);
    this.feeForm.patchValue(feeTrunc);
  }

  toggleCustomFee() {
    this.customFee = !this.customFee;
    if (!this.customFee) this.onFeeChoose(this.activeButton);
  }

  onFeeChoose(value) {
    let fee: number = 0;
    if (value === 1) {
      fee = this.feeSlow;
      this.kindFee = 'Slow';
    } else if (value === 2) {
      fee = this.feeMedium;
      this.kindFee = 'Average';
    } else {
      fee = this.feeFast;
      this.kindFee = 'Fast';
    }

    const feeCurrency = fee * this.currencyRate.value;
    this.formSend.patchValue({
      fee: fee,
      feeCurr: feeCurrency,
    });
    this.activeButton = value;
  }
}
