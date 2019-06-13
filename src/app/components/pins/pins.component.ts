import { Component, OnInit, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "field-pins",
  templateUrl: "./pins.component.html",
  styleUrls: ["./pins.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PinsComponent),
      multi: true
    }
  ]
})
export class PinsComponent implements OnInit, ControlValueAccessor {
  @Input() digit: number = 6;

  pins = [];

  value = "";

  values: any = {};

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < this.digit; i++) {
      this.pins.push(i);
    }
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
    const el = event.target;
    const newValue = event.target.value;

    this.values[index + 1] = newValue;

    let value = "";
    let _hasEmpty = false;
    for (let i = 0; i < this.digit; i++) {
      const _key = i + 1;
      if (!this.values.hasOwnProperty(_key) || !this.values[_key]) {
        _hasEmpty = true;
        break;
      }
    }

    if (!_hasEmpty) {
      value = Object.values(this.values).join("");
    }

    if (newValue.length == el.maxLength) {
      const _parent = $(el).parent();
      const _next = _parent.next("div");

      if (_next.length) {
        _parent
          .next("div")
          .find("input")
          .focus();
      } else {
        el.blur();
      }
    }

    this._onChange(value);
  }
}
