import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { signTransactionHash } from 'zbc-sdk';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { getTranslation, stringToBuffer } from 'src/helpers/utils';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-participants',
  templateUrl: './add-participants.component.html',
})
export class AddParticipantsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  transactionHashField = new FormControl('', Validators.required);
  participantsSignatureField = new FormArray([]);

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  account: SavedAccount;
  participants = [];
  getSignature: boolean = false;
  isSendDialog: boolean = false;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private authServ: AuthService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<AddParticipantsComponent>,
    @Inject(MAT_DIALOG_DATA) data: MultiSigDraft
  ) {
    this.form = new FormGroup({
      transactionHash: this.transactionHashField,
      participantsSignature: this.participantsSignatureField,
    });

    this.multisig = data;
  }

  ngOnInit() {
    if (this.multisig.signaturesInfo === undefined) return this.router.navigate(['/multisignature']);
    this.patchValue(this.multisig);
    this.participants = this.multisig.multisigInfo.participants.map(pc => pc.value);
  }

  ngOnDestroy() {
    if (this.multisigSubs) this.multisigSubs.unsubscribe();
    this.authServ.switchMultisigAccount();
  }

  createParticipant(address: string, signature: string, required: boolean): FormGroup {
    let validator = Validators.required;
    if (!required) validator = null;
    return this.formBuilder.group({
      address: [address, validator],
      signature: [signature, validator],
    });
  }

  patchValue(multisig: MultiSigDraft) {
    const { signaturesInfo } = multisig;
    this.transactionHashField.patchValue(signaturesInfo.txHash);
    this.patchParticipant(signaturesInfo.participants);
  }

  patchParticipant(participant: any[]) {
    participant.forEach(pcp => {
      let address: string = '';
      let signature: string = '';
      if (typeof pcp === 'object') {
        address = pcp.address.value;
        signature = Buffer.from(pcp.signature).toString('base64');
      } else address = pcp;
      this.participantsSignatureField.push(this.createParticipant(address, signature, false));
    });
  }

  updateMultiStorage() {
    const { transactionHash, participantsSignature } = this.form.value;

    const multisig = { ...this.multisig };
    const newPcp = participantsSignature.map(pcp => {
      pcp.signature = stringToBuffer(pcp.signature);
      return {
        address: { value: pcp.address, type: 0 },
        signature: pcp.signature,
      };
    });

    multisig.signaturesInfo = {
      txHash: transactionHash,
      participants: newPcp,
    };

    this.multisigServ.update(multisig);
  }

  onBack() {
    this.location.back();
  }

  async onNext() {
    const signatures = this.participantsSignatureField.value.filter(
      sign => sign.signature !== null && sign.signature.length > 0
    );
    if (signatures.length > 0) {
      const { txHash } = this.multisig.signaturesInfo;
      this.transactionHashField.patchValue(txHash);
      this.updateMultiStorage();
      this.isSendDialog = true;
      return true;
    }
    let message = getTranslation('at least 1 signature must be filled', this.translate);
    Swal.fire('Error', message, 'error');
  }

  onSave() {
    this.updateMultiStorage();
    if (this.multisig.id == 0) {
      this.multisigServ.saveDraft();
    } else {
      this.multisigServ.editDraft();
    }
    this.dialogRef.close(true);
  }

  onAddSignature() {
    const { txHash, participants } = this.multisig.signaturesInfo;
    let idx: number;
    idx = participants.findIndex(pcp => pcp.address.value == this.account.address.value);

    if (this.account.type === 'multisig' && idx == -1)
      idx = participants.findIndex(pcp => pcp.address.value == this.account.address.value);
    let message = getTranslation('this account is not in participant list', this.translate);
    if (idx == -1) return Swal.fire('Error', message, 'error');
    const seed = this.authServ.seed;
    const signature = signTransactionHash(txHash, seed);

    this.participantsSignatureField.controls[idx].get('signature').patchValue(signature.toString('base64'));
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.authServ.switchAccount(account);
  }

  toggleGetSignature() {
    this.getSignature = !this.getSignature;
  }
}
