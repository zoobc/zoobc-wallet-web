import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { MultisigService, MultiSigDraft } from 'src/app/services/multisig.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-multisig-info',
  templateUrl: './add-multisig-info.component.html',
  styleUrls: ['./add-multisig-info.component.scss'],
})
export class AddMultisigInfoComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper: MatStepper;

  isCompleted = true;
  minParticipants = 3;

  isMultiSignature: boolean = false;
  minParticipant: number = 2;

  form: FormGroup;
  participantsField = new FormArray([]);
  nonceField = new FormControl('', [Validators.required, Validators.min(1)]);
  minSignatureField = new FormControl('', [Validators.required, Validators.min(2)]);

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  constructor(private fb: FormBuilder, private multisigServ: MultisigService, private router: Router) {
    this.form = new FormGroup({
      participants: this.participantsField,
      nonce: this.nonceField,
      minSigs: this.minSignatureField,
    });
  }

  ngOnInit() {
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      this.multisig = multisig;

      this.pushInitParticipant();

      if (multisig.multisigInfo) {
        const { participants, minSigs, nonce } = multisig.multisigInfo;
        this.participantsField.setValue(participants);
        this.nonceField.setValue(nonce);
        this.minSignatureField.setValue(minSigs);
      }
    });

    this.stepper.selectedIndex = 0;
  }

  ngOnDestroy() {
    if (this.multisigSubs) this.multisigSubs.unsubscribe();
  }

  pushInitParticipant() {
    while (this.participantsField.length > 0) {
      this.participantsField.removeAt(0);
    }

    let len = this.minParticipant;
    const multisigInfo = this.multisig.multisigInfo;
    if (multisigInfo) {
      const participants = multisigInfo.participants;
      len = participants.length >= 2 && participants.length;
    }

    for (let i = 0; i < len; i++) {
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

  removeParticipant(index: number) {
    if (this.participantsField.length > this.minParticipant) {
      this.participantsField.removeAt(index);
    } else {
      Swal.fire('Error', `Minimum participants is ${this.minParticipant}`, 'error');
    }
  }

  onSwitchAccount() {}

  saveDraft() {
    console.log(this.form.value);
    const { minSigs, nonce } = this.form.value;
    const multisig = { ...this.multisig };

    let participants: string[] = this.form.value;
    participants.sort();
    console.log(participants);

    multisig.multisigInfo = {
      minSigs: parseInt(minSigs),
      nonce: parseInt(nonce),
      participants: participants,
      multisigAddress: '',
    };

    this.multisigServ.saveDraft();
    this.router.navigate(['/multisignature']);
  }

  next(e) {
    e.preventDefault();
    if (this.form.valid) {
      this.updateMultisig();

      const { multisigInfo, unisgnedTransactions, signaturesInfo } = this.multisig;
      if (unisgnedTransactions !== undefined) this.router.navigate(['/multisignature/create-transaction']);
      else {
        this.router.navigate(['/multisignature/send-transaction']);
      }
    }
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
    this.multisigServ.update(multisig);
  }
}
