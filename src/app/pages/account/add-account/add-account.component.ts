import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import zoobc, { getZBCAdress, MultiSigAddress } from 'zoobc-sdk';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss'],
})
export class AddAccountComponent implements OnInit {
  lenAccount = this.authServ.getAllAccount().length + 1;

  formAddAccount: FormGroup;
  accountNameField = new FormControl(`Account ${this.lenAccount}`, Validators.required);
  participantsField = new FormArray([], this.uniqueParticipant);
  nonceField = new FormControl('', [Validators.required, Validators.min(1)]);
  minSignatureField = new FormControl('', [Validators.required, Validators.min(2)]);

  signBy: SavedAccount;

  isMultiSignature: boolean = false;
  minParticipant: number = 2;

  constructor(
    private authServ: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<AddAccountComponent>
  ) {
    this.formAddAccount = new FormGroup({
      name: this.accountNameField,
      participants: this.participantsField,
      nonce: this.nonceField,
      minimumSignature: this.minSignatureField,
    });
  }

  ngOnInit() {
    this.disableFieldMultiSignature();
  }

  onAddAccount() {
    if (this.formAddAccount.valid) {
      let account: SavedAccount;

      if (this.isMultiSignature) {
        const multiParam: MultiSigAddress = {
          participants: this.participantsField.value.filter(value => value.length > 0),
          nonce: this.nonceField.value,
          minSigs: this.minSignatureField.value,
        };
        const multiSignAddress: string = zoobc.MultiSignature.createMultiSigAddress(multiParam);
        account = {
          name: this.accountNameField.value,
          type: 'multisig',
          path: this.signBy.path,
          nodeIP: null,
          address: multiSignAddress,
          participants: this.participantsField.value.filter(value => value.length > 0),
          nonce: this.nonceField.value,
          minSig: this.minSignatureField.value,
          signByAddress: this.signBy.address,
        };
      } else {
        const keyring = this.authServ.keyring;
        const path = this.authServ.generateDerivationPath();
        const childSeed = keyring.calcDerivationPath(path);
        const accountAddress = getZBCAdress(childSeed.publicKey);
        account = {
          name: this.accountNameField.value,
          type: 'normal',
          path,
          nodeIP: null,
          address: accountAddress,
        };
      }

      this.authServ.addAccount(account);
      this.dialogRef.close();
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
    const length: number = this.participantsField.length;
    if (length >= 2) {
      this.participantsField.push(new FormControl(''));
    } else {
      this.participantsField.push(new FormControl('', [Validators.required]));
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
}
