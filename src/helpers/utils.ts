// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

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

import { ValidationErrors, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

export function onCopyText(text: string) {
  let isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);
  let selBox = document.createElement('textarea');
  let range = document.createRange();
  let selection;
  selBox.style.position = 'fixed';
  selBox.style.opacity = '0';
  selBox.value = text;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  if (isiOSDevice) {
    range.selectNodeContents(selBox);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    selBox.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.
  }
  document.execCommand('copy');
  document.body.removeChild(selBox);
}

export function truncate(num: number, places: number): number {
  return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
}

export function calcMinFee(data: any) {
  const blockPeriod = 10 * 1e8;
  const feePerBlockPeriod = 0.01 * 1e8;

  if (data.timeout) {
    return (Math.ceil((data.timeout * 1e8) / blockPeriod) * feePerBlockPeriod) / 1e8;
  } else return feePerBlockPeriod / 1e8;
}

export function uniqueParticipant(formArray: FormArray): ValidationErrors {
  const values = formArray.value.filter(val => val.length > 0);
  const controls = formArray.controls;
  const result = values.some((element, index) => {
    return values.indexOf(element) !== index;
  });
  const invalidControls = controls.filter(ctrl => ctrl.valid === false);
  if (result && invalidControls.length == 0) {
    return { duplicate: true };
  }
  return null;
}

export function getTranslation(
  value: string,
  translateService: TranslateService,
  interpolateParams?: Object
) {
  let message: string;
  translateService.get(value, interpolateParams).subscribe(res => {
    message = res;
  });
  return message;
}

export function stringToBuffer(str: string) {
  return Buffer.from(str, 'base64');
}

export function jsonBufferToString(buf: any) {
  if (!buf) return '';
  try {
    return Buffer.from(buf.data, 'base64').toString('base64');
  } catch (error) {
    return buf.toString('base64');
  }
}
