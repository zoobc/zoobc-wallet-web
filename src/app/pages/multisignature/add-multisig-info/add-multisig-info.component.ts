import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MultisigService, MultiSigDraft } from 'src/app/services/multisig.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import zoobc, { MultiSigAddress } from 'zoobc-sdk';
import { uniqueParticipant, getTranslation } from '../../../../helpers/utils';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Account } from 'zoobc-sdk/types/helper/interfaces';

@Component({
  selector: 'app-add-multisig-info',
  templateUrl: './add-multisig-info.component.html',
  styleUrls: ['./add-multisig-info.component.scss'],
})
export class AddMultisigInfoComponent implements OnInit, OnDestroy {
  stepper = {
    transaction: false,
    signatures: false,
  };

  form: FormGroup;
  participantsField = new FormArray([], uniqueParticipant);
  nonceField = new FormControl('', [Validators.required, Validators.min(1)]);
  minSignatureField = new FormControl('', [Validators.required, Validators.min(2)]);

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private authServ: AuthService,
    private translate: TranslateService
  ) {
    this.form = new FormGroup({
      participants: this.participantsField,
      nonce: this.nonceField,
      minSigs: this.minSignatureField,
    });
  }

  ngOnInit() {
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
      if (multisigInfo === undefined) this.router.navigate(['/multisignature']);

      this.multisig = multisig;
      this.pushInitParticipant();

      if (multisigInfo) {
        const { participants, minSigs, nonce } = multisigInfo;
        const addressParticipant = participants.map(pc => pc.address);
        this.patchParticipant(addressParticipant);
        this.nonceField.setValue(nonce);
        this.minSignatureField.setValue(minSigs);
      }

      if (signaturesInfo && signaturesInfo.txHash) this.form.disable();

      this.stepper.transaction = unisgnedTransactions !== undefined ? true : false;
      this.stepper.signatures = signaturesInfo !== undefined ? true : false;
    });
  }

  ngOnDestroy() {
    if (this.multisigSubs) this.multisigSubs.unsubscribe();
  }

  pushInitParticipant(minParticpant: number = 2) {
    while (this.participantsField.length > 0) this.participantsField.removeAt(0);

    for (let i = 0; i < minParticpant; i++)
      this.participantsField.push(new FormControl('', [Validators.required]));
  }

  patchParticipant(participants: string[]) {
    while (this.participantsField.controls.length !== 0) this.participantsField.removeAt(0);

    participants.forEach((pcp, index) => {
      if (index <= 1) this.participantsField.push(new FormControl(pcp, [Validators.required]));
      else this.participantsField.push(new FormControl(pcp));
    });
  }

  onSwitchAccount(account: SavedAccount) {
    if (account != undefined) {
      this.patchParticipant(account.participants);
      this.nonceField.setValue(account.nonce);
      this.minSignatureField.setValue(account.minSig);
    }
  }

  addParticipant() {
    this.participantsField.push(new FormControl(''));
  }

  removeParticipant(index: number) {
    this.participantsField.removeAt(index);
  }

  saveDraft() {
    this.updateMultisig();
    if (this.multisig.id) this.multisigServ.editDraft();
    else this.multisigServ.saveDraft();
    this.router.navigate(['/multisignature']);
  }

  next() {
    this.form.enable();
    if (this.form.valid) {
      this.updateMultisig();

      const { unisgnedTransactions, signaturesInfo } = this.multisig;
      let isOneParticpants: boolean = false;
      const idx = this.authServ
        .getAllAccount()
        .filter(res => this.multisig.multisigInfo.participants.some(ps => ps.address == res.address));
      if (idx.length > 0) isOneParticpants = true;
      else isOneParticpants = false;
      if (!isOneParticpants) {
        let message = getTranslation('you dont have any account that in participant list', this.translate);
        Swal.fire({ type: 'error', title: 'Oops...', text: message });
      } else {
        if (unisgnedTransactions !== undefined) this.router.navigate(['/multisignature/create-transaction']);
        else if (signaturesInfo !== undefined) this.router.navigate(['/multisignature/add-signatures']);
        else this.router.navigate(['/multisignature/send-transaction']);
      }
    }
  }

  back() {
    this.location.back();
  }

  updateMultisig() {
    const { minSigs, nonce } = this.form.value;
    const multisig = { ...this.multisig };

    let participants: string[] = this.form.value.participants;

    participants.sort();
    participants = participants.filter(address => address != '');
    let arrParticipant: Account[] = participants.map(pc => {
      return { address: pc, type: 0 };
    });
    multisig.multisigInfo = {
      minSigs: parseInt(minSigs),
      nonce: parseInt(nonce),
      participants: arrParticipant,
    };

    const address = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);
    multisig.generatedSender = address.address;
    this.multisigServ.update(multisig);
  }
}
