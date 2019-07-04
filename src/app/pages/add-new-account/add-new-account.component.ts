import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { AccountService, SavedAccount } from 'src/app/services/account.service';
import { Router } from '@angular/router';
import * as wif from 'wif';
import * as ecc from 'tiny-secp256k1';

@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-new-account.component.html',
  styleUrls: ['./add-new-account.component.scss'],
})
export class AddNewAccountComponent implements OnInit {
  lenAccount = this.accServ.getAllAccount().length + 1;

  formAddAccount: FormGroup;
  accountNameField = new FormControl(
    `Account ${this.lenAccount}`,
    Validators.required
  );

  formImportAccount: FormGroup;
  privateKeyField = new FormControl(``, Validators.required);

  constructor(
    private appServ: AppService,
    private accServ: AccountService,
    private router: Router
  ) {
    this.formAddAccount = new FormGroup({
      name: this.accountNameField,
    });

    this.formImportAccount = new FormGroup({
      privateKey: this.privateKeyField,
      name: this.accountNameField,
    });
  }

  ngOnInit() {}

  onAddAccount() {
    if (this.formAddAccount.valid) {
      const path = this.accServ.generateDerivationPath();
      const account: SavedAccount = {
        name: this.accountNameField.value,
        path,
        imported: false,
      };

      this.accServ.addAccount(account);
      this.router.navigateByUrl('/');
    }
  }

  onImportAccount() {
    if (this.formImportAccount.valid) {
      const decoded = wif.decode(this.privateKeyField.value);
      const buffer = decoded.privateKey;

      if (!ecc.isPrivate(buffer))
        throw new TypeError('Private key not in range [1, n)');

      const options = { compressed: decoded.compressed, network: 128 };
      const publicKey = ecc.pointFromScalar(buffer, decoded.compressed);
      const account: SavedAccount = {
        name: this.accountNameField.value,
        secret: this.privateKeyField.value,
        imported: true,
      };

      this.accServ.addAccount(account);
      this.router.navigateByUrl('/');
    }
  }
}
