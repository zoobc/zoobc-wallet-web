import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import * as wif from 'wif';
import { getZBCAddress, ZooKeyring } from 'zbc-sdk';

@Component({
  selector: 'app-private-key',
  templateUrl: './private-key.component.html',
})
export class PrivateKeyComponent {
  form: FormGroup;
  privKeyField = new FormControl('', Validators.required);

  constructor(
    private authServ: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<PrivateKeyComponent>
  ) {
    this.form = new FormGroup({
      privateKey: this.privKeyField,
    });
  }

  onLogin() {
    // if (this.form.valid) {
    //   const bip = wif.decode(this.privKeyField.value);
    //   const keyring = new ZooKeyring('');
    //   const seed = keyring.generateBip32ExtendedKey('ed25519', bip);
    //   const address = getZBCAddress(seed.publicKey);

    //   const account: SavedAccount = {
    //     name: 'Imported Account',
    //     address: { type: 0, value: address },
    //     type: 'one time login',
    //   };
    //   if (this.authServ.loginWithoutPin(account, seed)) {
    //     this.dialogRef.close();
    //     this.router.navigateByUrl('/dashboard');
    //   }
    // }
  }
}
