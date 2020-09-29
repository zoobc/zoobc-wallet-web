import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Currency } from 'src/app/services/currency-rate.service';

@Component({
  selector: 'form-setup-account-dataset',
  templateUrl: './form-setup-account-dataset.component.html',
})
export class FormSetupAccountDatasetComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() formValue: any;
  @Input() currencyRate: Currency;
  @Input() isSetupOther: boolean = false;
  @Output() enableSetupOther?: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  ngOnInit() {
    console.log('ayam', this.formValue);
    console.log(this.group);
    console.log(this.currencyRate);
    console.log(this.enableSetupOther);
  }

  onToggleEnableSetupOther() {
    this.enableSetupOther.emit(true);
  }
}
