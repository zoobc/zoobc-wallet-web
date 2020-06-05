import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, ValidationErrors } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { signTransactionHash } from 'zoobc-sdk';
import Swal from 'sweetalert2';

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

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private authServ: AuthService,
    private formBuilder: FormBuilder
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
    this.enabledAddParticipant = this.checkEnabledAddParticipant(this.multisig);
    this.readOnlyTxHash = this.checkReadOnlyTxHash(this.multisig);
    this.readOnlyAddress = this.checkReadOnlyAddress(this.multisig);
  }

  ngOnDestroy() {
    if (this.multisigSubs) this.multisigSubs.unsubscribe();
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
    const { signaturesInfo, multisigInfo, unisgnedTransactions } = multisig;

    if (!signaturesInfo || signaturesInfo == null) {
      if (multisigInfo) return this.patchParticipant(multisigInfo.participants);
      if (unisgnedTransactions) return this.patchUnsignedAddress(unisgnedTransactions.sender);
      return this.pushInitParticipant(2, this.authServ.getCurrAccount());
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
        signature = pcp.signature;
      } else address = pcp;
      this.participantsSignatureField.push(this.createParticipant(address, signature, true));
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
    const { unisgnedTransactions } = multisig;
    if (!unisgnedTransactions || unisgnedTransactions == null) return false;
    const txHash = this.generateRandomTxHash();
    this.transactionHashField.patchValue(txHash);
    return true;
  }

  checkReadOnlyAddress(multisig: MultiSigDraft) {
    const { multisigInfo, unisgnedTransactions } = multisig;
    if (multisigInfo || unisgnedTransactions) return true;
    if (this.authServ.getCurrAccount().type === 'multisig') return true;
    return false;
  }

  pushInitParticipant(minParticipant: number = 2, curAccount: SavedAccount) {
    if (curAccount.type == 'normal') {
      for (let i = 0; i < minParticipant; i++) {
        this.participantsSignatureField.push(this.createParticipant('', '', true));
      }
      return null;
    }
    curAccount.participants.forEach(pcp => {
      this.participantsSignatureField.push(this.createParticipant(pcp, '', true));
    });
  }

  addParticipant() {
    this.participantsSignatureField.push(this.createParticipant('', '', false));
  }

  removeParticipant(index: number) {
    this.participantsSignatureField.removeAt(index);
  }

  uniqueParticipant(formArray: FormArray): ValidationErrors {
    //console.log(formArray);
    // const values = formArray.value.filter(val => val.length > 0);
    // const controls = formArray.controls;
    // const result = values.some((element, index) => {
    //   return values.indexOf(element) !== index;
    // });
    // const invalidControls = controls.filter(ctrl => ctrl.valid === false);
    // if (result && invalidControls.length == 0) {
    //   return { duplicate: true };
    // }
    return null;
  }

  updateMultiStorage() {
    const { transactionHash, participantsSignature } = this.form.value;
    const multisig = { ...this.multisig };

    multisig.signaturesInfo = {
      txHash: transactionHash,
      participants: participantsSignature,
    };

    this.multisigServ.update(multisig);
  }

  jsonBufferToString(buf: any) {
    try {
      return Buffer.from(buf.data, 'utf-8').toString();
    } catch (error) {
      return buf.toString('utf-8');
    }
  }

  stringToBuffer(str: string) {
    return Buffer.from(str, 'utf-8');
  }

  onBack() {
    this.location.back();
  }

  onNext() {
    this.updateMultiStorage();
    this.router.navigate(['/multisignature/send-transaction']);
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

  onAddSignature() {
    const { transactionHash, participantsSignature } = this.form.value;
    const curAcc = this.authServ.getCurrAccount();
    let idx: number;
    idx = participantsSignature.findIndex(pcp => pcp.address == curAcc.address);
    if (curAcc.type === 'multisig' && idx == -1)
      idx = participantsSignature.findIndex(pcp => pcp.address == curAcc.signByAddress);
    if (idx == -1) return Swal.fire('Error', 'This account is not in Participant List', 'error');
    const seed = this.authServ.seed;
    const signature = signTransactionHash(transactionHash, seed);
    this.participantsSignatureField.controls[idx].get('signature').patchValue(signature.toString('base64'));
  }

  //temporary function
  generateRandomTxHash(length: number = 10) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  //temporary function end here
}
