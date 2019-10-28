import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
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
    private router: Router,
    private dialogRef: MatDialogRef<AddAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public account: SavedAccount
  ) {
    this.formEditAccount = new FormGroup({
      name: this.accountNameField,
    });
    this.accountNameField.patchValue(this.account.name);
  }

  ngOnInit() {}

  onEditAccount() {
    if (this.formEditAccount.valid) {
      let accounts = this.authServ.getAllAccount();
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        if (account.path == this.account.path) {
          accounts[i].name = this.accountNameField.value;
          break;
        }
      }
      let currAcc = this.authServ.getCurrAccount();
      if (currAcc.path == this.account.path) {
        currAcc.name = this.accountNameField.value;
        localStorage.setItem('CURR_ACCOUNT', JSON.stringify(currAcc));
      }

      localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
      this.dialogRef.close(true);
      this.router.navigateByUrl('/');
    }
  }
}
