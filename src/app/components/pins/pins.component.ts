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

//     2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
// contact us at roberto.capodieci[at]blockchainzoo.com
// and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import {
  Component,
  OnInit,
  forwardRef,
  Input,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'field-pins',
  templateUrl: './pins.component.html',
  styleUrls: ['./pins.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PinsComponent),
      multi: true,
    },
  ],
})
export class PinsComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  @Input() digit: number = 6;
  @ViewChildren('pinDigit') pinDigit: QueryList<ElementRef>;

  pins = [];
  values: any = {};
  constructor(private router: Router) {}

  ngOnInit() {
    for (let i = 0; i < this.digit; i++) {
      this.pins.push(i);
    }
  }

  ngAfterViewInit() {
    this.getWhiteClass();
    setTimeout(() => {
      const child = this.pinDigit.first.nativeElement.children[0].children[0].children[0].children[2]
        .children[0];
      child.focus();
    }, 50);
  }

  private _onChange = (value: any) => {};

  writeValue(value: any) {}

  registerOnChange(fn: any) {
    this._onChange = fn;
  }

  registerOnTouched() {}

  onChange(index, event) {
    // set regex number only
    const pinValue: string = event.target.value;
    const regex = RegExp(/\d+/);

    // if user press backspace
    if (event.keyCode == 8) {
      const prevDigit = this.pinDigit.find((element, i) => i + 1 == index);

      if (prevDigit) {
        const children = prevDigit.nativeElement.children[0].children[0].children[0].children[2].children[0];
        children.focus();
      }
    }

    // if regex is true
    if (regex.test(pinValue)) {
      this.pinDigit.forEach((el: ElementRef, key) => {
        // focus to next field
        if (key == index + 1) {
          const children = el.nativeElement.children[0].children[0].children[0].children[2].children[0];

          children.focus();
        }
      });
    } else {
      // regex is false
      this.pinDigit.forEach((el: ElementRef, key) => {
        // clear current field
        if (key == index) {
          const children = el.nativeElement.children[0].children[0].children[0].children[2].children[0];
          children.value = '';
        }
      });
    }

    this.values[index + 1] = pinValue;

    let value = '';
    let _hasEmpty = false;
    for (let i = 0; i < this.digit; i++) {
      const _key = i + 1;
      if (!this.values.hasOwnProperty(_key) || !this.values[_key]) {
        _hasEmpty = true;
        break;
      }
    }

    if (!_hasEmpty) {
      value = Object.values(this.values).join('');
    }

    this._onChange(value);
  }

  onReset() {
    this.pinDigit.forEach((el: ElementRef, key) => {
      const children = el.nativeElement.children[0].children[0].children[0].children[2].children[0];
      children.value = '';
    });
    this.values = [];

    setTimeout(() => {
      const child = this.pinDigit.first.nativeElement.children[0].children[0].children[0].children[2]
        .children[0];
      child.focus();
    }, 50);
  }

  getWhiteClass() {
    if (this.router.url.includes('/login')) {
      this.pinDigit.forEach(item => {
        item.nativeElement.classList.add('white');
      });
    }
  }
}
