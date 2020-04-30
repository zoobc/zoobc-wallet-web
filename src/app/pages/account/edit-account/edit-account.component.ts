import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
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
  nonceField = new FormControl('', [Validators.required, Validators.min(1)]);
  minSignatureField = new FormControl('', [Validators.required, Validators.min(2)]);
  tempAddressField = new FormControl(this.account.address);
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
      tempAddress: this.tempAddressField,
    });
    this.accountNameField.patchValue(this.account.name);
    if (this.account.type == 'multisig') this.patchMultiSignatureForm();
  }

  ngOnInit() {
    this.enableFieldMultiSignature();
    if (!this.isMultiSignature) this.disableFieldMultiSignature();
  }

  patchMultiSignatureForm() {
    this.isMultiSignature = true;
    this.patchPartisipant();
    this.nonceField.patchValue(this.account.nonce);
    this.minSignatureField.patchValue(this.account.minSig);
  }

  patchPartisipant() {
    while (this.participantsField.controls.length !== 0) {
      this.participantsField.removeAt(0);
    }
    this.account.participants.map((pcp, index) => {
      if (index > 1) {
        this.participantsField.push(new FormControl(pcp, [this.participantNotMainAddress]));
      } else {
        this.participantsField.push(
          new FormControl(pcp, [Validators.required, this.participantNotMainAddress])
        );
      }
    });
  }

  onEditAccount() {
    if (this.formEditAccount.valid) {
      let accounts = this.authServ.getAllAccount();
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        if (account.address == this.account.address) {
          accounts[i].name = this.accountNameField.value;
          if (this.isMultiSignature) {
            accounts[i].participants = this.participantsField.value.filter(value => value.length > 0);
            accounts[i].nonce = this.nonceField.value;
            accounts[i].minSig = this.minSignatureField.value;
            accounts[i].signByAddress = this.signBy.address;
            accounts[i].path = this.signBy.path;
          }
          break;
        }
      }
      let currAcc = this.authServ.getCurrAccount();
      if (currAcc.path == this.account.path) {
        currAcc.name = this.accountNameField.value;
        if (this.isMultiSignature) {
          currAcc.participants = this.participantsField.value.filter(value => value.length > 0);
          currAcc.nonce = this.nonceField.value;
          currAcc.minSig = this.minSignatureField.value;
          currAcc.path = this.signBy.path;
          currAcc.signByAddress = this.signBy.address;
        }
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

  pushInitParticipant() {
    while (this.participantsField.length > 0) {
      this.participantsField.removeAt(0);
    }
    for (let i = 0; i < this.minParticipant; i++) {
      this.participantsField.push(new FormControl('', [Validators.required, this.participantNotMainAddress]));
    }
  }

  addParticipant() {
    const length: number = this.participantsField.length;
    if (length >= 2) {
      this.participantsField.push(new FormControl('', [this.participantNotMainAddress]));
    } else {
      this.participantsField.push(new FormControl('', [Validators.required, this.participantNotMainAddress]));
    }
  }

  reComposeValidation() {
    let presentValidator: ValidatorFn = this.participantsField.controls[1].validator;
    this.participantsField.controls[1].setValidators([presentValidator, Validators.required]);
    this.participantsField.controls[1].updateValueAndValidity();
  }

  removeParticipant(index: number) {
    if (this.participantsField.length > this.minParticipant) {
      this.participantsField.removeAt(index);
      if (index <= 1) this.reComposeValidation();
    } else {
      Swal.fire('Error', `Minimum participants is ${this.minParticipant}`, 'error');
    }
  }

  onSwitchSignBy(account: SavedAccount) {
    this.signBy = account;
  }

  uniqueParticipant(formArray: FormArray): ValidationErrors {
    const values = formArray.value.filter(val => val.length > 0);
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

  participantNotMainAddress(formControl: FormControl): ValidationErrors {
    try {
      const mainAddress = formControl.parent.parent.get('tempAddress').value;
      if (mainAddress == formControl.value) {
        return { isMainAddress: true };
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
