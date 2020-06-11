import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import zoobc, { getZBCAdress, MultiSigAddress } from 'zoobc-sdk';
import { uniqueParticipant } from '../../../../helpers/utils';

@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss'],
})
export class AddAccountComponent {
  formAddAccount: FormGroup;
  accountNameField = new FormControl('', Validators.required);
  participantsField = new FormArray([], uniqueParticipant);
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

  onAddAccount() {
    if (this.formAddAccount.valid) {
      let account: SavedAccount;

      if (this.isMultiSignature) {
        let participants: [string] = this.participantsField.value.filter(value => value.length > 0);
        participants = participants.sort();

        const multiParam: MultiSigAddress = {
          participants: participants,
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
          participants: participants,
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
      this.dialogRef.close(true);
    }
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
}
