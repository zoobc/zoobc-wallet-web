// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Currency } from 'src/app/services/currency-rate.service';
import { environment } from 'src/environments/environment';
import { truncate, getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'fee-selector',
  templateUrl: './fee-selector.component.html',
  styleUrls: ['./fee-selector.component.scss'],
})
export class FeeSelectorComponent implements OnInit, OnChanges {
  @Input() group: FormGroup;
  @Input() feeName: string;
  @Input() feeCurrName: string;
  @Input() required: boolean;
  @Input() currencyRate: Currency;
  @Input() minFee: number;
  @Input() timeoutField: number;
  @Output() onClickFeeChoose = new EventEmitter();
  @Input() typeFees?: number;
  @Input() customFeeValue?: number;
  @Input() readonly?: boolean = false;

  feeSlow = environment.fee;
  feeMedium = this.feeSlow * 2;
  feeFast = this.feeMedium * 2;
  activeButton: number = 2;
  kindFee: string;

  typeCoin = 'ZBC';
  typeFee = 'ZBC';

  customFee: boolean = false;

  constructor(private translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.timeoutField) {
      this.feeSlow = this.minFee;
      this.feeMedium = this.feeSlow * 2;
      this.feeFast = this.feeMedium * 2;
      if (this.customFee == false) {
        let value: number = 0;
        switch (this.kindFee) {
          case 'Slow':
            value = this.feeSlow;
            break;
          case 'Fast':
            value = this.feeFast;
            break;
          default:
            value = this.feeMedium;
        }
        this.group.get(this.feeName).patchValue(value);
      }
    }
  }

  ngOnInit() {
    if (this.customFeeValue) {
      const feeCurrency = this.customFeeValue * this.currencyRate.value;
      this.group.patchValue({
        fee: this.customFeeValue,
        feeCurr: feeCurrency,
      });
      this.toggleCustomFee(event);
    } else if (this.typeFees) {
      this.onFeeChoose(this.typeFees);
    } else {
      this.setDefaultFee();
    }
  }

  onChangeFeeField(value) {
    const fee = truncate(value, 8);
    const feeCurrency = fee * this.currencyRate.value;
    this.group.get(this.feeCurrName).patchValue(feeCurrency);
  }

  onChangeFeeCurrencyField(value) {
    const fee = value / this.currencyRate.value;
    const feeTrunc = truncate(fee, 8);
    this.group.get(this.feeName).patchValue(feeTrunc);
  }

  toggleCustomFee(event) {
    event.preventDefault();
    this.customFee = !this.customFee;
    if (this.customFee) {
      this.kindFee = getTranslation('custom', this.translate);
      this.onClickFeeChoose.emit(this.kindFee);
    } else {
      this.onFeeChoose(this.activeButton);
    }
  }

  onFeeChoose(value) {
    let fee: number = 0;
    if (value === 1) {
      fee = this.feeSlow;
      this.kindFee = getTranslation('slow', this.translate);
      this.onClickFeeChoose.emit(this.kindFee);
    } else if (value === 2) {
      fee = this.feeMedium;
      this.kindFee = getTranslation('average', this.translate);
      this.onClickFeeChoose.emit(this.kindFee);
    } else {
      fee = this.feeFast;
      this.kindFee = getTranslation('fast', this.translate);
      this.onClickFeeChoose.emit(this.kindFee);
    }

    const feeCurrency = fee * this.currencyRate.value;
    this.group.patchValue({
      fee: fee,
      feeCurr: feeCurrency,
    });
    this.activeButton = value;
  }

  setDefaultFee() {
    this.onFeeChoose(2);
  }
}
