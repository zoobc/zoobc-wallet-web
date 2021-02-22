import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-message',
  templateUrl: './form-message.component.html',
})
export class FormMessageComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() inputMap: any;

  showMessage: boolean = false;

  constructor() {}

  ngOnInit() {}

  toggleAdvancedMenu() {
    this.showMessage = !this.showMessage;
    this.enableFieldMessage();
    if (!this.showMessage) this.disableFieldMessage();
  }

  resetValue() {
    this.group.get(this.inputMap.message).reset();
  }

  enableFieldMessage() {
    this.group.get(this.inputMap.message).enable();
    this.resetValue();
  }

  disableFieldMessage() {
    this.group.get(this.inputMap.message).disable();
  }
}
