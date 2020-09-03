import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import zoobc, { getZBCAddress, MultiSigAddress } from 'zoobc-sdk';
import { uniqueParticipant } from '../../../../helpers/utils';
import Swal from 'sweetalert2';
import { getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss'],
})
export class AddAccountComponent implements OnInit {
  formAddAccount: FormGroup;
  accountNameField = new FormControl('', Validators.required);
  participantsField = new FormArray([], uniqueParticipant);
  nonceField = new FormControl('', [Validators.required, Validators.min(1)]);
  minSignatureField = new FormControl('', [Validators.required, Validators.min(2)]);
  signFormField = new FormControl('', [Validators.required]);
  signBy: SavedAccount;

  isMultiSignature: boolean = false;
  minParticipant: number = 2;

  constructor(
    private authServ: AuthService,
    private dialogRef: MatDialogRef<AddAccountComponent>,
    private translate: TranslateService
  ) {
    this.formAddAccount = new FormGroup({
      name: this.accountNameField,
      participants: this.participantsField,
      nonce: this.nonceField,
      minimumSignature: this.minSignatureField,
      sign: this.signFormField,
    });

    this.pushInitParticipant();
    this.disableFieldMultiSignature();
  }

  ngOnInit() {}

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
        address: accountAddress,
      };
      this.authServ.addAccount(account);
      return this.dialogRef.close(true);
    }

    let title = getTranslation('are you sure?', this.translate);
    let message = getTranslation(
      'once you create multisignature address, you will not be able to edit it anymore. but you can still delete it',
      this.translate
    );
    let buttonText = getTranslation('yes, continue it!', this.translate);
    Swal.fire({
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: buttonText,
      type: 'warning',
    }).then(res => {
      if (!res.value) return null;
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
      this.authServ.addAccount(account);
      return this.dialogRef.close(true);
    });
  }

  disableFieldMultiSignature() {
    this.isMultiSignature = false;

    this.participantsField.disable();
    this.nonceField.disable();
    this.minSignatureField.disable();
    this.signFormField.disable();

    const len = this.authServ.getAllAccount('normal').length + 1;
    this.accountNameField.setValue(`Account ${len}`);
  }

  enableFieldMultiSignature() {
    this.isMultiSignature = true;

    this.participantsField.enable();
    this.nonceField.enable();
    this.minSignatureField.enable();
    this.signFormField.enable();

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
    if (account) this.signFormField.setValue(account.address);
  }
}
