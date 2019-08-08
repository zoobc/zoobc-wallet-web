import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-pin-setup-dialog',
  templateUrl: './pin-setup-dialog.component.html',
  styleUrls: ['./pin-setup-dialog.component.scss'],
})
export class PinSetupDialogComponent implements OnInit {
  setPin = true;
  confirmPin = false;
  isPinMatched: boolean;

  formSetPin: FormGroup;
  pinForm = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern('^[0-9]*$'),
  ]);

  formConfirmPin: FormGroup;
  pin2Form = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern('^[0-9]*$'),
  ]);

  constructor(public dialogRef: MatDialogRef<PinSetupDialogComponent>) {
    this.formSetPin = new FormGroup({
      pin: this.pinForm,
    });

    this.formConfirmPin = new FormGroup({
      pin: this.pin2Form,
    });
  }

  ngOnInit() {}

  onSetPin() {
    if (this.formSetPin.valid) {
      this.setPin = false;
      this.confirmPin = true;
    }
  }

  onConfirmPin() {
    if (this.formConfirmPin.valid) {
      if (this.pin2Form.value == this.pinForm.value) {
        const key = CryptoJS.PBKDF2(this.pinForm.value, 'salt', {
          keySize: 8,
          iterations: 10000,
        }).toString();

        this.dialogRef.close(key);
      } else {
        this.isPinMatched = false;
      }
    }
  }

  onBack() {
    this.setPin = true;
    this.confirmPin = false;
    this.formSetPin.reset();
    this.formConfirmPin.reset();
  }

  onResetPinValidation() {
    this.isPinMatched = null;
  }
}
