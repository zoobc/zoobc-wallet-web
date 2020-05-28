import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { onCopyText } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
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

  selectedDesign: number = 1;
  account: SavedAccount;
  transactionHash: string = '';
  url: string = 'https://zoobc.one/...SxhdnfHF';
  enabledAddParticipant: boolean = false;
  readOnlyTxHash: boolean = false;

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  constructor(
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private activeRoute: ActivatedRoute,
    private authServ: AuthService
  ) {
    this.form = new FormGroup({
      transactionHash: this.transactionHashField,
      participantsSignature: this.participantsSignatureField,
    });
  }

  ngOnInit() {
    this.multisigSubs = this.multisigServ.multisig.subscribe((multisig) => {
      this.multisig = multisig;
    });
    this.account = this.authServ.getCurrAccount();
    if (this.activeRoute.snapshot.params['txHash']) {
      const txHash = this.activeRoute.snapshot.params['txHash'];
      const signature = this.activeRoute.snapshot.params['signature'];
      this.prefillForm(txHash, signature);
    } else {
      if (this.multisig.signaturesInfo === undefined) return this.router.navigate(['/multisignature']);
      this.patchValue(this.multisig);
      this.enabledAddParticipant = this.checkEnabledAddParticipant(this.multisig);
    }
  }

  ngOnDestroy() {
    if (this.multisigSubs) this.multisigSubs.unsubscribe();
  }

  prefillForm(txHash: string, sign: String) {}

  patchValue(multisig: MultiSigDraft) {
    const { signaturesInfo, multisigInfo, unisgnedTransactions } = multisig;

    if (!signaturesInfo || signaturesInfo == null) {
      if (multisigInfo) return this.patchParticipant(multisigInfo.participants, true);
      if (unisgnedTransactions) return this.patchUnsignedAddress(unisgnedTransactions.sender);
      return this.pushInitParticipant();
    }
    if (signaturesInfo.txHash) this.transactionHashField.patchValue(signaturesInfo.txHash);
    if (signaturesInfo.participants) this.patchParticipant(signaturesInfo.participants, false);
    this.enabledAddParticipant = true;
  }

  patchUnsignedAddress(addres: string) {
    const accounts = this.authServ.getAllAccount();
    const account = accounts.find((acc) => acc.address == addres);
    this.patchParticipant(account.participants, true);
  }

  checkEnabledAddParticipant(multisig: MultiSigDraft) {
    const { multisigInfo, unisgnedTransactions } = multisig;
    if (multisigInfo || unisgnedTransactions) return false;
    return true;
  }

  patchParticipant(participant: any[], empty: boolean) {
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

  pushInitParticipant(minParticipant: number = 2) {
    for (let i = 0; i < minParticipant; i++) {
      this.participantsSignatureField.push(new FormControl('', [Validators.required]));
    }
  }

  addParticipant() {
    this.participantsSignatureField.push(new FormControl(''));
  }

  removeParticipant(index: number) {
    this.participantsSignatureField.removeAt(index);
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
    participantsSignature
      .filter((pcp) => pcp.length > 0)
      .map((pcp, index) => {
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
