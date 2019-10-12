import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { generateEncKey } from 'src/helpers/utils';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-pin-confirmation',
  templateUrl: './pin-confirmation.component.html',
  styleUrls: ['./pin-confirmation.component.scss'],
})
export class PinConfirmationComponent implements OnInit {
  formConfirmPin: FormGroup;
  pinField = new FormControl('', Validators.required);

  isFormSendLoading = false;
  isConfirmPinLoading = false;

  constructor(
    private authServ: AuthService,
    public dialogRef: MatDialogRef<PinConfirmationComponent>
  ) {
    this.formConfirmPin = new FormGroup({
      pin: this.pinField,
    });
  }

  ngOnInit() {}

  onTypePin() {
    if (this.pinField.value.length == 6) {
      this.isConfirmPinLoading = true;

      // give some delay so that the dom have time to render the spinner
      setTimeout(() => {
        const key = generateEncKey(this.pinField.value);
        const encSeed = localStorage.getItem('ENC_MASTER_SEED');
        const isPinValid = this.authServ.isPinValid(encSeed, key);
        if (isPinValid) this.dialogRef.close(true);
        else this.formConfirmPin.setErrors({ invalid: true });
        this.isConfirmPinLoading = false;
      }, 50);
    }
  }
}
