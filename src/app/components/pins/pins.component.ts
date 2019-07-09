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
export class PinsComponent
  implements OnInit, ControlValueAccessor, AfterViewInit {
  @Input() digit: number = 6;
  @ViewChildren('pinDigit') pinDigit: QueryList<ElementRef>;

  pins = [];
  value = '';
  values: any = {};

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < this.digit; i++) {
      this.pins.push(i);
    }
  }

  ngAfterViewInit() {
    // focus to first field
    const children = this.pinDigit.first.nativeElement.children[0].children[0]
      .children[0].children[0].children[0];
    children.focus();
  }

  private _onChange = (value: any) => {};

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any) {
    this._onChange = fn;
  }

  registerOnTouched() {}

  onChange(index, event) {
    // set regex number only
    const pinValue: string = event.target.value;
    const regex = RegExp(/\d+/);

    // if user press backpress
    if (event.keyCode == 8 && this.values[6] == '') {
      this.pinDigit.forEach((el: ElementRef, key) => {
        if (key == index - 1) {
          // back to prev field and clear the value
          el.nativeElement.children[0].focus();
          el.nativeElement.children[0].value = '';
        }
      });
    }

    // if regex is true
    if (regex.test(pinValue)) {
      this.pinDigit.forEach((el: ElementRef, key) => {
        // focus to next field
        if (key == index + 1) {
          const children =
            el.nativeElement.children[0].children[0].children[0].children[0]
              .children[0];
          children.focus();
        }
      });
    } else {
      // regex is false
      this.pinDigit.forEach((el: ElementRef, key) => {
        // clear current field
        if (key == index) {
          const children =
            el.nativeElement.children[0].children[0].children[0].children[0]
              .children[0];
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
}
