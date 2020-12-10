import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MultisigService, MultiSigDraft } from 'src/app/services/multisig.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import zoobc, { Address } from 'zoobc-sdk';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation, uniqueParticipant } from 'src/helpers/utils';

@Component({
  selector: 'app-add-multisig-info',
  templateUrl: './add-multisig-info.component.html',
  styleUrls: ['./add-multisig-info.component.scss'],
})
export class AddMultisigInfoComponent implements OnInit, OnDestroy {
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
      const { multisigInfo } = multisig;
      if (multisigInfo === undefined) this.router.navigate(['/multisignature']);

      this.multisig = multisig;
      this.pushInitParticipant();

      if (multisigInfo) {
        const { participants, minSigs, nonce } = multisigInfo;
        const addressParticipant = participants;
        this.patchParticipant(addressParticipant);
        this.nonceField.setValue(nonce);
        this.minSignatureField.setValue(minSigs);
      }
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

  patchParticipant(participants: Address[]) {
    while (this.participantsField.controls.length !== 0) this.participantsField.removeAt(0);

    participants.forEach((pcp, index) => {
      if (index <= 1) this.participantsField.push(new FormControl(pcp.value, [Validators.required]));
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

  next() {
    if (this.form.valid) {
      const addresses = this.sortAddresses();
      const accounts = this.authServ
        .getAllAccount()
        .filter(res => addresses.some(ps => ps.value == res.address.value));

      if (accounts.length <= 0) {
        let message = getTranslation('you dont have any account that in participant list', this.translate);
        Swal.fire({ type: 'error', title: 'Oops...', text: message });
        return false;
      }

      const { minSigs, nonce } = this.form.value;
      const multisig = { ...this.multisig };
      multisig.multisigInfo = {
        minSigs: parseInt(minSigs),
        nonce: parseInt(nonce),
        participants: addresses,
      };
      const sender = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);
      multisig.txBody.sender = sender;
      this.multisigServ.update(multisig);

      this.router.navigate(['/multisignature/create/create-transaction']);
    }
  }

  back() {
    this.location.back();
  }

  sortAddresses(): Address[] {
    const participants: string[] = this.form.value.participants;
    return participants
      .sort()
      .filter(address => address != '')
      .map(pc => ({ value: pc, type: 0 }));
  }
}
