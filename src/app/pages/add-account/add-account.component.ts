import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { GetAddressFromPublicKey } from 'src/helpers/utils';

const coin = 'ZBC';
@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss'],
})
export class AddAccountComponent implements OnInit {
  lenAccount = this.authServ.getAllAccount().length + 1;

  formAddAccount: FormGroup;
  accountNameField = new FormControl(
    `Account ${this.lenAccount}`,
    Validators.required
  );

  constructor(
    private authServ: AuthService,
    private router: Router,
    private keyringServ: KeyringService,
    private dialogRef: MatDialogRef<AddAccountComponent>
  ) {
    this.formAddAccount = new FormGroup({
      name: this.accountNameField,
    });
  }

  ngOnInit() {}

  onAddAccount() {
    if (this.formAddAccount.valid) {
      const path = this.authServ.generateDerivationPath();
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(
        coin,
        path
      );
      const accountAddress = GetAddressFromPublicKey(childSeed.publicKey);
      const account: SavedAccount = {
        name: this.accountNameField.value,
        path,
        nodeIP: null,
        address: accountAddress,
      };

      this.authServ.addAccount(account);
      this.dialogRef.close();
      this.router.navigateByUrl('/');
    }
  }
}
