import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { SavedAccount } from 'src/app/services/auth.service';
import { onCopyText } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-participants',
  templateUrl: './add-participants.component.html',
  styleUrls: ['./add-participants.component.scss'],
})
export class AddParticipantsComponent implements OnInit, OnDestroy {
  form: FormGroup;

  transactionHashField = new FormControl('', Validators.required);
  participantsSignatureField = new FormArray([]);
  participantsAddressField = new FormArray([]);

  minParticipant: number = 3;
  selectedDesign: number = 1;
  account: SavedAccount;
  transactionHash: string = 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb';
  url: string = 'https://zoobc.one/...SxhdnfHF';

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  constructor(
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location
  ) {
    this.form = new FormGroup({
      transactionHash: this.transactionHashField,
      participantsSignature: this.participantsSignatureField,
    });
  }

  ngOnInit() {
    this.multisigSubs = this.multisigServ.multisig.subscribe((multisig) => {
      if (multisig.signaturesInfo === undefined) return this.router.navigate(['/multisignature']);
      this.multisig = multisig;
      this.patchValue(this.multisig);
    });
  }

  ngOnDestroy() {
    if (this.multisigSubs) this.multisigSubs.unsubscribe();
  }

  patchValue(multisig: MultiSigDraft) {
    const { signaturesInfo, multisigInfo } = multisig;

    if (!signaturesInfo) {
      if (!multisigInfo) return this.pushInitParticipant();
      return this.patchParticipant(multisigInfo.participants, true);
    }
    if (signaturesInfo.txHash) this.transactionHashField.patchValue(signaturesInfo.txHash);
    if (!signaturesInfo.participants) {
      if (!multisigInfo) return this.pushInitParticipant();
      return this.patchParticipant(multisigInfo.participants, true);
    }
    this.patchParticipant(signaturesInfo.participants, false);
  }

  patchParticipant(participant: any[], empty: boolean) {
    while (this.participantsSignatureField.controls.length !== 0) {
      this.participantsSignatureField.removeAt(0);
    }

    participant.map((pcp) => {
      if (empty) {
        this.participantsSignatureField.push(new FormControl('', [Validators.required]));
      } else {
        this.participantsSignatureField.push(
          new FormControl(this.jsonBufferToString(pcp.signature), [Validators.required])
        );
      }
    });
  }

  pushInitParticipant() {
    while (this.participantsSignatureField.length > 0) {
      this.participantsSignatureField.removeAt(0);
    }
    for (let i = 0; i < this.minParticipant; i++) {
      this.participantsSignatureField.push(new FormControl('', [Validators.required]));
    }
  }

  jsonBufferToString(buf: any) {
    try {
      return Buffer.from(buf.data, 'utf8').toString();
    } catch (error) {
      return buf.toString();
    }
  }

  stringToBuffer(str: string) {
    return Buffer.from(str, 'utf8');
  }

  getAddress(idx: number) {
    const { signaturesInfo, multisigInfo } = this.multisig;
    if (!signaturesInfo) {
      if (!multisigInfo) return '';
      if (multisigInfo.participants.length > 0) return multisigInfo.participants[idx];
      return '';
    }

    if (signaturesInfo.participants.length > 0) return signaturesInfo.participants[idx].address;
    return '';
  }

  updateMultiStorage() {
    const { transactionHash, participantsSignature } = this.form.value;
    const multisig = { ...this.multisig };

    let participant = [];
    participantsSignature.map((pcp, index) => {
      participant[index] = {
        address: this.getAddress(index),
        signature: this.stringToBuffer(String(pcp)),
      };
    });

    multisig.signaturesInfo = {
      txHash: transactionHash,
      participants: participant,
    };

    this.multisigServ.update(multisig);
  }

  onBack() {
    this.location.back();
  }

  onNext() {
    console.log('Next button pressed');
  }

  onSave() {
    if (!this.form.valid) return null;
    this.updateMultiStorage();
    if (this.multisig.id == 0) {
      this.multisigServ.saveDraft();
    } else {
      this.multisigServ.editDraft();
    }
    this.router.navigate(['/multisignature']);
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
  }

  onAddSignature() {
    console.log('add your signature');
  }

  async onCopyUrl() {
    onCopyText(this.url);
    let message: string;
    await this.translate
      .get('Link Copied')
      .toPromise()
      .then((res) => (message = res));
    this.snackBar.open(message, null, { duration: 3000 });
  }
}
