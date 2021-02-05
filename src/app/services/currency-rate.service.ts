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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Currency {
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyRateService {
  private defaultRate: Currency = { name: 'USD', value: 0 };
  private sourceRate = new BehaviorSubject(this.defaultRate);
  rate: Observable<Currency> = this.sourceRate.asObservable();

  zbcPriceInUsd = 1;

  constructor(private http: HttpClient) {
    const rate = JSON.parse(localStorage.getItem('RATE')) || this.defaultRate;
    this.sourceRate.next(rate);
  }

  getRate(): Promise<Currency> {
    const currencyName = this.sourceRate.getValue().name;
    const url = `https://api.exchangeratesapi.io/latest?base=USD&symbols=${currencyName}`;
    return new Promise((resolve, reject) => {
      this.http
        .get(url)
        .toPromise()
        .then((res: any) => {
          const rate: Currency = {
            name: currencyName,
            value: res.rates[currencyName] * this.zbcPriceInUsd,
          };

          this.updateRate(rate);
          resolve(rate);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  getRates(): Promise<Currency[]> {
    const url = 'https://api.exchangeratesapi.io/latest?base=USD&symbols=USD';
    return new Promise((resolve, reject) => {
      this.http
        .get(url)
        .toPromise()
        .then((res: any) => {
          let rates = Object.keys(res.rates).map(currencyName => {
            const rate = {
              name: currencyName,
              value: res.rates[currencyName] * this.zbcPriceInUsd,
            };
            if (this.sourceRate.getValue().name == currencyName) this.updateRate(rate);
            return rate;
          });
          rates.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
          });
          resolve(rates);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  updateRate(rate: Currency) {
    this.sourceRate.next(rate);
    localStorage.setItem('RATE', JSON.stringify(rate));
  }
}
