import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MultisigService, MultiSigDraft } from 'src/app/services/multisig.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SavedAccount } from 'src/app/services/auth.service';
import zoobc from 'zoobc-sdk';

@Component({
  selector: 'app-add-multisig-info',
  templateUrl: './add-multisig-info.component.html',
  styleUrls: ['./add-multisig-info.component.scss'],
})
export class AddMultisigInfoComponent implements OnInit, OnDestroy {
  multiSigDrafts: MultiSigDraft[];
  isCompleted = true;

  isMultiSignature: boolean = false;
  stepper = {
    transaction: false,
    signatures: false,
  };

  form: FormGroup;
  participantsField = new FormArray([]);
  nonceField = new FormControl('', [Validators.required, Validators.min(1)]);
  minSignatureField = new FormControl('', [Validators.required, Validators.min(2)]);

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  constructor(private multisigServ: MultisigService, private router: Router, private location: Location) {
    this.form = new FormGroup({
      participants: this.participantsField,
      nonce: this.nonceField,
      minSigs: this.minSignatureField,
    });
  }

  ngOnInit() {
    this.getMultiSigDraft();
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
      if (multisigInfo === undefined) this.router.navigate(['/multisignature']);

      this.multisig = multisig;
      this.pushInitParticipant();

      if (multisigInfo) {
        const { participants, minSigs, nonce } = multisigInfo;
        this.patchParticipant(participants);
        this.nonceField.setValue(nonce);
        this.minSignatureField.setValue(minSigs);
      }

      this.stepper.transaction = unisgnedTransactions !== undefined ? true : false;
      this.stepper.signatures = signaturesInfo !== undefined ? true : false;
    });
  }

  ngOnDestroy() {
    if (this.multisigSubs) this.multisigSubs.unsubscribe();
  }

  pushInitParticipant(minParticpant: number = 2) {
    while (this.participantsField.length > 0) {
      this.participantsField.removeAt(0);
    }

    for (let i = 0; i < minParticpant; i++) {
      this.participantsField.push(new FormControl('', [Validators.required]));
    }
  }

  patchParticipant(participants: string[]) {
    while (this.participantsField.controls.length !== 0) {
      this.participantsField.removeAt(0);
    }

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

  getMultiSigDraft() {
    this.multiSigDrafts = this.multisigServ.getDrafts();
  }

  saveDraft() {
    this.updateMultisig();
    const isDraft = this.multiSigDrafts.some(draft => draft.id == this.multisig.id);
    if (isDraft) {
      this.multisigServ.editDraft();
    } else {
      this.multisigServ.saveDraft();
    }
    this.router.navigate(['/multisignature']);
  }

  next() {
    if (this.form.valid) {
      this.updateMultisig();

      const { unisgnedTransactions, signaturesInfo } = this.multisig;
      if (unisgnedTransactions !== undefined) this.router.navigate(['/multisignature/create-transaction']);
      else if (signaturesInfo !== undefined) this.router.navigate(['/multisignature/add-signatures']);
      else this.router.navigate(['/multisignature/send-transaction']);
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

    multisig.multisigInfo = {
      minSigs: parseInt(minSigs),
      nonce: parseInt(nonce),
      participants: participants,
      multisigAddress: '',
    };
    const address = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);
    multisig.generatedSender = address;
    this.multisigServ.update(multisig);
  }
}
