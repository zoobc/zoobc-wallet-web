import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService, SavedAccount } from 'src/app/services/account.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss'],
})
export class AddAccountComponent implements OnInit {
  lenAccount = this.accServ.getAllAccount().length + 1;

  formAddAccount: FormGroup;
  accountNameField = new FormControl(
    `Account ${this.lenAccount}`,
    Validators.required
  );

  constructor(
    private accServ: AccountService,
    private router: Router,
    private dialogRef: MatDialogRef<AddAccountComponent>
  ) {
    this.formAddAccount = new FormGroup({
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
      };

      this.accServ.addAccount(account);
      this.dialogRef.close();
      this.router.navigateByUrl('/');
    }
  }
}
