import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddAccountComponent } from '../add-account/add-account.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
})
export class EditAccountComponent implements OnInit {
  formEditAccount: FormGroup;
  accountNameField = new FormControl('', Validators.required);
  participantsField = new FormArray([], this.uniqueParticipant);
  nonceField = new FormControl('', Validators.required);
  minSignatureField = new FormControl('', [Validators.required, Validators.min(1)]);

  signBy: SavedAccount;

  isMultiSignature: boolean = false;
  minParticipant: number = 2;

  constructor(
    private authServ: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<AddAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public account: SavedAccount
  ) {
    this.formEditAccount = new FormGroup({
      name: this.accountNameField,
      participants: this.participantsField,
      nonce: this.nonceField,
      minimumSignature: this.minSignatureField,
    });
    this.accountNameField.patchValue(this.account.name);
  }

  ngOnInit() {
    this.signBy = this.authServ.getCurrAccount();
    this.disableFieldMultiSignature();
  }

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

  disableFieldMultiSignature() {
    this.participantsField.disable();
    this.nonceField.disable();
    this.minSignatureField.disable();
  }

  enableFieldMultiSignature() {
    this.participantsField.enable();
    this.nonceField.enable();
    this.minSignatureField.enable();
  }

  toogleMultiSignature() {
    this.isMultiSignature = !this.isMultiSignature;
    if (this.isMultiSignature) {
      this.enableFieldMultiSignature();
      this.pushInitParticipant();
    } else {
      this.disableFieldMultiSignature();
    }
  }

  pushInitParticipant() {
    while (this.participantsField.length > 0) {
      this.participantsField.removeAt(0);
    }
    for (let i = 0; i < this.minParticipant; i++) {
      this.participantsField.push(new FormControl('', [Validators.required]));
    }
  }

  addParticipant() {
    this.participantsField.push(new FormControl('', Validators.required));
  }

  removeParticipant(index: number) {
    if (this.participantsField.length > this.minParticipant) {
      this.participantsField.removeAt(index);
    } else {
      Swal.fire('Error', `Minimum participants is ${this.minParticipant}`, 'error');
    }
  }

  onSwitchSignBy(account: SavedAccount) {
    this.signBy = account;
  }

  uniqueParticipant(formArray: FormArray): ValidationErrors {
    const values = formArray.value;
    const controls = formArray.controls;
    const result = values.some((element, index) => {
      return values.indexOf(element) !== index;
    });
    const invalidControls = controls.filter(ctrl => ctrl.valid === false);
    if (result && invalidControls.length == 0) {
      return { duplicate: true };
    }
    return null;
  }

  trackByFn(index) {
    return index;
  }
}
