import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, ValidationErrors } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { signTransactionHash } from 'zoobc-sdk';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { getTranslation, stringToBuffer } from 'src/helpers/utils';

@Component({
  selector: 'app-add-participants',
  templateUrl: './add-participants.component.html',
  styleUrls: ['./add-participants.component.scss'],
})
export class AddParticipantsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  transactionHashField = new FormControl('', Validators.required);
  participantsSignatureField = new FormArray([], this.uniqueParticipant);

  account: SavedAccount;
  enabledAddParticipant: boolean = false;
  readOnlyTxHash: boolean = false;
  readOnlyAddress: boolean = false;
  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  stepper = {
    multisigInfo: false,
    transaction: false,
  };

  participants = [];
  disableSign: boolean = true;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private authServ: AuthService,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {
    this.form = new FormGroup({
      transactionHash: this.transactionHashField,
      participantsSignature: this.participantsSignatureField,
    });
  }

  ngOnInit() {
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo, unisgnedTransactions } = multisig;
      this.multisig = multisig;
      this.stepper.multisigInfo = multisigInfo !== undefined ? true : false;
      this.stepper.transaction = unisgnedTransactions !== undefined ? true : false;
    });
    if (this.multisig.signaturesInfo === undefined) return this.router.navigate(['/multisignature']);
    this.patchValue(this.multisig);
    this.participants = this.multisig.multisigInfo.participants;
    const idx = this.authServ.getAllAccount().filter(res => this.participants.includes(res.address));
    if (idx.length > 0) this.disableSign = true;
    else this.disableSign = false;
    this.enabledAddParticipant = this.checkEnabledAddParticipant(this.multisig);
    this.readOnlyTxHash = this.checkReadOnlyTxHash(this.multisig);
    this.readOnlyAddress = this.checkReadOnlyAddress(this.multisig);
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
    const { signaturesInfo, multisigInfo, unisgnedTransactions, transaction } = multisig;

    if (!signaturesInfo || signaturesInfo == null) {
      if (multisigInfo) return this.patchParticipant(multisigInfo.participants);
      if (unisgnedTransactions) return this.patchUnsignedAddress(transaction.sender);
      return this.pushInitParticipant(1, this.authServ.getCurrAccount());
    }
    if (signaturesInfo.txHash) this.transactionHashField.patchValue(signaturesInfo.txHash);
    if (signaturesInfo.participants) this.patchParticipant(signaturesInfo.participants);
    this.enabledAddParticipant = true;
  }

  patchParticipant(participant: any[]) {
    participant.forEach(pcp => {
      let address: string = '';
      let signature: string = '';
      if (typeof pcp === 'object') {
        address = pcp.address;
        signature = Buffer.from(pcp.signature).toString('base64');
      } else address = pcp;
      this.participantsSignatureField.push(this.createParticipant(address, signature, false));
    });
  }

  patchUnsignedAddress(addres: string) {
    const accounts = this.authServ.getAllAccount();
    const account = accounts.find(acc => acc.address == addres);
    this.patchParticipant(account.participants);
  }

  checkEnabledAddParticipant(multisig: MultiSigDraft) {
    const { multisigInfo, unisgnedTransactions } = multisig;
    if (multisigInfo || unisgnedTransactions) return false;
    if (this.authServ.getCurrAccount().type === 'multisig') return false;
    return true;
  }

  checkReadOnlyTxHash(multisig: MultiSigDraft) {
    const { signaturesInfo, unisgnedTransactions } = multisig;
    if (!signaturesInfo || signaturesInfo == null) return false;
    if (!unisgnedTransactions) return false;
    const txHash = signaturesInfo.txHash;
    this.transactionHashField.patchValue(txHash);
    return true;
  }

  checkReadOnlyAddress(multisig: MultiSigDraft) {
    const { multisigInfo, unisgnedTransactions } = multisig;
    if (multisigInfo || unisgnedTransactions) return true;
    if (this.authServ.getCurrAccount().type === 'multisig') return true;
    return false;
  }

  pushInitParticipant(minParticipant: number, curAccount: SavedAccount) {
    if (curAccount.type == 'normal') {
      for (let i = 0; i < minParticipant; i++) {
        this.participantsSignatureField.push(this.createParticipant('', '', true));
      }
      return null;
    }
    curAccount.participants.forEach(pcp => {
      this.participantsSignatureField.push(this.createParticipant(pcp, '', false));
    });
  }

  addParticipant() {
    this.participantsSignatureField.push(this.createParticipant('', '', false));
  }

  removeParticipant(index: number) {
    this.participantsSignatureField.removeAt(index);
  }

  uniqueParticipant(formArray: FormArray): ValidationErrors {
    let values: string[] = [];
    formArray.value.map(val => {
      if (val.address.length > 0) values.push(val.address);
    });
    const controls = formArray.controls;
    const result = values.some((element, index) => {
      return values.indexOf(element) !== index;
    });
    const invalidControls = controls.filter(ctrl => ctrl.get('address').valid === false);
    if (result && invalidControls.length == 0) {
      return { duplicate: true };
    }
    return null;
  }

  updateMultiStorage() {
    const { transactionHash, participantsSignature } = this.form.value;
    const multisig = { ...this.multisig };

    const newPcp = participantsSignature.map(pcp => {
      pcp.signature = stringToBuffer(pcp.signature);
      return pcp;
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
      this.updateMultiStorage();
      return this.router.navigate(['/multisignature/send-transaction']);
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
    this.router.navigate(['/multisignature']);
  }

  onAddSignature() {
    const { transactionHash, participantsSignature } = this.form.value;
    let idx: number;
    idx = participantsSignature.findIndex(pcp => pcp.address == this.account.address);
    if (this.account.type === 'multisig' && idx == -1)
      idx = participantsSignature.findIndex(pcp => pcp.address == this.account.address);
    let message = getTranslation('this account is not in participant list', this.translate);
    if (idx == -1) return Swal.fire('Error', message, 'error');
    const seed = this.authServ.seed;
    const signature = signTransactionHash(transactionHash, seed);
    this.participantsSignatureField.controls[idx].get('signature').patchValue(signature.toString('base64'));
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.authServ.switchAccount(account);
  }
}
