import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
})
export class AddressComponent {
  form: FormGroup;
  addressField = new FormControl('', Validators.required);

  constructor(
    private authServ: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<AddressComponent>
  ) {
    this.form = new FormGroup({
      address: this.addressField,
    });
  }

  onLogin() {
    if (this.form.valid) {
      const account: SavedAccount = {
        name: 'View Only Account',
        address: { type: 0, value: this.addressField.value },
        type: 'address',
      };
      if (this.authServ.loginWithoutPin(account)) {
        this.dialogRef.close();
        this.router.navigateByUrl('/dashboard');
      }
    }
  }
}
