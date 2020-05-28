import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddAccountComponent } from '../add-account/add-account.component';
import zoobc, { MultiSigAddress } from 'zoobc-sdk';

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
  newMultiSigAddress: string;

  constructor(
    private authServ: AuthService,
    private dialogRef: MatDialogRef<AddAccountComponent>,
    @Inject(MAT_DIALOG_DATA) private account: SavedAccount
  ) {
    this.formEditAccount = new FormGroup({
      name: this.accountNameField,
      participants: this.participantsField,
      nonce: this.nonceField,
      minimumSignature: this.minSignatureField,
      tempAddress: this.tempAddressField,
    });
  }

  ngOnInit() {
    this.accountNameField.patchValue(this.account.name);
    if (this.account.type == 'multisig') {
      this.enableFieldMultiSignature();
      this.pushInitParticipant(this.account.participants.length);
      this.prefillAccount();
    } else {
      this.disableFieldMultiSignature();
    }
  }

  prefillAccount() {
    this.participantsField.setValue(this.account.participants);
    this.nonceField.setValue(this.account.nonce);
    this.minSignatureField.setValue(this.account.minSig);
  }

  onEditAccount() {
    if (this.formEditAccount.valid) {
      let accounts = this.authServ.getAllAccount();
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        if (account.address == this.account.address) {
          accounts[i].name = this.accountNameField.value;
          if (this.isMultiSignature) {
            const multiParam: MultiSigAddress = {
              participants: this.participantsField.value.filter(value => value.length > 0),
              nonce: this.nonceField.value,
              minSigs: this.minSignatureField.value,
            };

            this.newMultiSigAddress = zoobc.MultiSignature.createMultiSigAddress(multiParam);

            accounts[i].address = this.newMultiSigAddress;
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
      if (currAcc.address == this.account.address) {
        currAcc.name = this.accountNameField.value;
        if (this.isMultiSignature) {
          currAcc.address = this.newMultiSigAddress;
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
    }
  }

  disableFieldMultiSignature() {
    this.isMultiSignature = false;

    this.participantsField.disable();
    this.nonceField.disable();
    this.minSignatureField.disable();
  }

  enableFieldMultiSignature() {
    this.isMultiSignature = true;

    this.participantsField.enable();
    this.nonceField.enable();
    this.minSignatureField.enable();
  }

  toogleMultiSignature() {
    if (!this.isMultiSignature) this.enableFieldMultiSignature();
    else this.disableFieldMultiSignature();
  }

  pushInitParticipant(size = 2) {
    for (let i = 0; i < size; i++) {
      if (i < this.minParticipant) this.participantsField.push(new FormControl('', [Validators.required]));
      else this.participantsField.push(new FormControl(''));
    }
  }

  addParticipant() {
    this.participantsField.push(new FormControl(''));
  }

  removeParticipant(index: number) {
    this.participantsField.removeAt(index);
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
