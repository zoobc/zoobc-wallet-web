import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddAccountComponent } from '../add-account/add-account.component';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
})
export class EditAccountComponent implements OnInit {
  formEditAccount: FormGroup;
  accountNameField = new FormControl('', Validators.required);

  constructor(
    private authServ: AuthService,
    private dialogRef: MatDialogRef<AddAccountComponent>,
    @Inject(MAT_DIALOG_DATA) private account: SavedAccount
  ) {
    this.formEditAccount = new FormGroup({
      name: this.accountNameField,
    });
  }

  ngOnInit() {
    this.accountNameField.patchValue(this.account.name);
  }

  onEditAccount() {
    if (this.formEditAccount.valid) {
      let accounts = this.authServ.getAllAccount();
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        if (account.address == this.account.address) {
          accounts[i].name = this.accountNameField.value;
          localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
          localStorage.setItem('CURR_ACCOUNT', JSON.stringify(accounts[i]));
          this.dialogRef.close(accounts[i]);
          break;
        }
      }
    }
  }
}
