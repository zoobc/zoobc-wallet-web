import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddAccountComponent } from '../add-account/add-account.component';
import { environment } from 'src/environments/environment';

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
        if (account.address.value == this.account.address.value) {
          accounts[i].name = this.accountNameField.value;
          const net = environment.production ? 'MAIN' : 'TEST';
          localStorage.setItem(`ACCOUNT_${net}`, JSON.stringify(accounts));
          localStorage.setItem(`CURR_ACCOUNT_${net}`, JSON.stringify(accounts[i]));
          this.dialogRef.close(accounts[i]);
          break;
        }
      }
    }
  }
}
