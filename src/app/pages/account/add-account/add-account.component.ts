import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import zoobc, { Address, getZBCAddress, MultiSigInfo } from 'zbc-sdk';

@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss'],
})
export class AddAccountComponent {
  formAddAccount: FormGroup;
  accountNameField = new FormControl('', Validators.required);
  participantsField = new FormArray([], this.uniqueParticipant);
  nonceField = new FormControl('', [Validators.required, Validators.min(1)]);
  minSignatureField = new FormControl('', [Validators.required, Validators.min(2)]);

  signBy: SavedAccount;

  isMultiSignature: boolean = false;
  minParticipant: number = 2;

  constructor(
    private authServ: AuthService,
    private dialogRef: MatDialogRef<AddAccountComponent>,
    @Inject(MAT_DIALOG_DATA) private account: SavedAccount
  ) {
    this.formAddAccount = new FormGroup({
      name: this.accountNameField,
      participants: this.participantsField,
      nonce: this.nonceField,
      minimumSignature: this.minSignatureField,
    });

    if (account) {
      this.enableFieldMultiSignature();
      this.pushInitParticipant(account.participants.length);
      this.prefillAccount();
    } else {
      this.pushInitParticipant();
      this.disableFieldMultiSignature();
    }
  }

  prefillAccount() {
    this.participantsField.setValue(this.account.participants);
    this.nonceField.setValue(this.account.nonce);
    this.minSignatureField.setValue(this.account.minSig);
  }

  async onAddAccount() {
    let account: SavedAccount;

    if (!this.isMultiSignature) {
      const keyring = this.authServ.keyring;
      const path = this.authServ.generateDerivationPath();
      const childSeed = keyring.calcDerivationPath(path);
      const accountAddress = getZBCAddress(childSeed.publicKey);
      account = {
        name: this.accountNameField.value,
        type: 'normal',
        path,
        nodeIP: null,
        address: { value: accountAddress, type: 0 },
      };
      this.authServ.addAccount(account);
      return this.dialogRef.close(true);
    }

    let title = 'are you sure?';
    let message =
      'once you create multisignature address, you will not be able to edit it anymore. but you can still delete it';
    let buttonText = 'yes, continue it!';
    Swal.fire({
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: buttonText,
      type: 'warning',
    }).then(res => {
      if (!res.value) return null;
      let addresses: [string] = this.participantsField.value.filter(value => value.length > 0);
      addresses = addresses.sort();
      const participants: Address[] = addresses.map(address => ({ value: address, type: 0 }));
      const multiParam: MultiSigInfo = {
        participants,
        nonce: this.nonceField.value,
        minSigs: this.minSignatureField.value,
      };
      const multiSignAddress = zoobc.MultiSignature.createMultiSigAddress(multiParam);
      account = {
        name: this.accountNameField.value,
        type: 'multisig',
        path: null,
        nodeIP: null,
        address: { value: multiSignAddress, type: 0 },
        participants: participants,
        nonce: this.nonceField.value,
        minSig: this.minSignatureField.value,
      };
      this.authServ.addAccount(account);
      return this.dialogRef.close(true);
    });
  }

  disableFieldMultiSignature() {
    this.isMultiSignature = false;

    this.participantsField.disable();
    this.nonceField.disable();
    this.minSignatureField.disable();

    const len = this.authServ.getAllAccount('normal').length + 1;
    this.accountNameField.setValue(`Account ${len}`);
  }

  enableFieldMultiSignature() {
    this.isMultiSignature = true;

    this.participantsField.enable();
    this.nonceField.enable();
    this.minSignatureField.enable();

    const len = this.authServ.getAllAccount('multisig').length + 1;
    this.accountNameField.setValue(`Multisig Account ${len}`);
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
