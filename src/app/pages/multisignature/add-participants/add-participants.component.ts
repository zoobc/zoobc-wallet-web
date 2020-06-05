import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
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
  participantsSignatureField = new FormArray([]);

  account: SavedAccount;
  enabledAddParticipant: boolean = false;
  readOnlyTxHash: boolean = false;
  readOnlyAddress: boolean = false;
  multisig: MultiSigDraft;
  multisigSubs: Subscription;
  participantAddress: string[] = [];

  stepper = {
    multisigInfo: false,
    transaction: false,
  };

  constructor(
    private translate: TranslateService,
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private activeRoute: ActivatedRoute,
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

    // if (this.activeRoute.snapshot.params['txHash']) {
    //   const { txHash, signature, address } = this.activeRoute.snapshot.params;
    //   const multiSignDraft = this.multisigServ
    //     .getDrafts()
    //     .find((draft) => draft.signaturesInfo.txHash == txHash);
    //   const participantValid = this.checkValidityParticipant(multiSignDraft, address);
    //   if (!multiSignDraft || !participantValid) {
    //     Swal.fire('Error', 'Draft not found', 'error');
    //     return this.router.navigate(['/multisignature']);
    //   }
    //   this.multisigServ.update(multiSignDraft);
    //   this.patchValue(this.multisig);
    //   this.prefillSignAddress(address, signature);
    //   this.enabledAddParticipant = this.checkEnabledAddParticipant(this.multisig);
    //   return (this.readOnlyTxHash = this.checkReadOnlyTxHash(this.multisig));
    // }

    if (this.multisig.signaturesInfo === undefined) return this.router.navigate(['/multisignature']);

    this.patchValue(this.multisig);
    this.enabledAddParticipant = this.checkEnabledAddParticipant(this.multisig);
    this.readOnlyTxHash = this.checkReadOnlyTxHash(this.multisig);
    this.readOnlyAddress = this.checkReadOnlyAddress(this.multisig);
    console.log(this.readOnlyAddress);
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

  checkValidityParticipant(multisig: MultiSigDraft, address: string) {
    const { signaturesInfo, multisigInfo, unisgnedTransactions } = multisig;
    if (
      !signaturesInfo ||
      signaturesInfo == null ||
      signaturesInfo.participants.filter(pcp => pcp.address.length == 0).length > 0
    ) {
      if (multisigInfo) {
        length = multisigInfo.participants.filter(pcp => pcp == address).length;
      } else if (unisgnedTransactions) {
        const accounts = this.authServ.getAllAccount();
        const account = accounts.find(acc => acc.address == unisgnedTransactions.sender);
        length = account.participants.filter(pcp => pcp == address).length;
      } else length = 1;
    } else length = signaturesInfo.participants.filter(pcp => pcp.address == address).length;
    if (length > 0) return true;
    return false;
  }

  patchValue(multisig: MultiSigDraft) {
    const { signaturesInfo, multisigInfo, unisgnedTransactions } = multisig;

    if (!signaturesInfo || signaturesInfo == null) {
      if (multisigInfo) return this.patchParticipant(multisigInfo.participants);
      if (unisgnedTransactions) return this.patchUnsignedAddress(unisgnedTransactions.sender);
      return this.pushInitParticipant();
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

  prefillSignAddress(address: string, signature: string) {
    let idx: number;
    idx = this.participantAddress.findIndex(pcp => pcp == address);
    if (idx < 0) {
      idx = this.multisig.signaturesInfo.participants.findIndex(
        pcp => this.jsonBufferToString(pcp.signature) == signature
      );
      if (idx < 0) idx = this.participantAddress.findIndex(pcp => pcp.length == 0);
      if (idx < 0) idx = 0;
    }

    this.participantsSignatureField.controls[idx].patchValue(signature);
  }

  checkEnabledAddParticipant(multisig: MultiSigDraft) {
    const { multisigInfo, unisgnedTransactions } = multisig;
    if (multisigInfo || unisgnedTransactions) return false;
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
    return false;
  }

  pushInitParticipant(minParticipant: number = 2) {
    for (let i = 0; i < minParticipant; i++) {
      this.participantsSignatureField.push(this.createParticipant('', '', true));
    }
  }

  addParticipant() {
    this.participantsSignatureField.push(this.createParticipant('', '', false));
  }

  removeParticipant(index: number) {
    this.participantsSignatureField.removeAt(index);
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
    const { multisigInfo, unisgnedTransactions } = this.multisig;
    const curAcc = this.authServ.getCurrAccount();
    const { transactionHash } = this.form.value;
    const seed = this.authServ.seed;
    const signature = signTransactionHash(transactionHash, seed);

    if (curAcc.type !== 'normal') return Swal.fire('Error', 'Multisig Account cant sign !', 'error');
    if (multisigInfo || unisgnedTransactions) {
      if (!this.participantAddress.includes(curAcc.address))
        return Swal.fire('Error', 'This account not in Participants', 'error');
      const index = this.participantAddress.indexOf(curAcc.address);
      return this.participantsSignatureField.controls[index].patchValue(signature.toString('base64'));
    }

    const index = this.participantsSignatureField.controls.findIndex(ctrl => ctrl.value.length == 0);
    if (index == -1)
      return this.participantsSignatureField.controls[
        this.participantsSignatureField.controls.length - 1
      ].patchValue(signature.toString('base64'));

    this.participantsSignatureField.controls[index].patchValue(signature.toString('base64'));
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
