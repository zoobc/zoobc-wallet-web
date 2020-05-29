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
  multisig: MultiSigDraft;
  multisigSubs: Subscription;
  participantAddress: string[] = [];

  selectedDesign: number = 1;
  url: string = 'https://zoobc.one/...SxhdnfHF';

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
    if (this.activeRoute.snapshot.params['txHash']) {
      const txHash = this.activeRoute.snapshot.params['txHash'];
      const signature = this.activeRoute.snapshot.params['signature'];
      const address = this.activeRoute.snapshot.params['address'];
      //add patch signature
      const multiSignDrafts = this.multisigServ.getDrafts();
      const multiSignDraft = multiSignDrafts.find((draft) => draft.signaturesInfo.txHash == txHash);
      const participantValid = this.checkParticipant(multiSignDraft, address);
      if (!multiSignDraft) {
        Swal.fire('Error', 'Draft not found', 'error');
        return this.router.navigate(['/multisignature']);
      }
      this.multisigServ.update(multiSignDraft);
    }
    if (this.multisig.signaturesInfo === undefined) return this.router.navigate(['/multisignature']);
    this.patchValue(this.multisig);
    this.enabledAddParticipant = this.checkEnabledAddParticipant(this.multisig);
    this.readOnlyTxHash = this.checkReadOnlyTxHash(this.multisig);
  }

  ngOnDestroy() {
    if (this.multisigSubs) this.multisigSubs.unsubscribe();
  }

  checkParticipant(multisig: MultiSigDraft, address: string) {
    const { signaturesInfo, multisigInfo, unisgnedTransactions } = multisig;
    if (!signaturesInfo || signaturesInfo == null) {
      let length: number;
      if (multisigInfo) {
        length = multisigInfo.participants.filter((pcp) => pcp == address).length;
      } else {
        const accounts = this.authServ.getAllAccount();
        const account = accounts.find((acc) => acc.address == unisgnedTransactions.sender);
        length = account.participants.filter((pcp) => pcp == address).length;
      }
      if (length > 0) return true;
      return false;
    }

    return null;
  }

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

  checkReadOnlyTxHash(multisig: MultiSigDraft) {
    const { unisgnedTransactions } = multisig;
    if (!unisgnedTransactions || unisgnedTransactions == null) return false;
    const txHash = this.generateRandomTxHash();
    this.transactionHashField.patchValue(txHash);
    return true;
  }

  patchParticipant(participant: any[], empty: boolean) {
    participant.forEach((pcp) => {
      if (typeof pcp === 'object') this.participantAddress.push(pcp.address);
      else this.participantAddress.push(pcp);

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
      this.participantAddress.push('');
      this.participantsSignatureField.push(new FormControl('', [Validators.required]));
    }
  }

  addParticipant() {
    this.participantAddress.push('');
    this.participantsSignatureField.push(new FormControl(''));
  }

  removeParticipant(index: number) {
    this.participantsSignatureField.removeAt(index);
    this.participantAddress.splice(index, 1);
  }

  getAddress(idx: number) {
    return this.participantAddress[idx];
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

  jsonBufferToString(buf: any) {
    try {
      return Buffer.from(buf.data, 'base64').toString();
    } catch (error) {
      return buf.toString('base64');
    }
  }

  stringToBuffer(str: string) {
    return Buffer.from(str, 'base64');
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

    const index = this.participantsSignatureField.controls.findIndex((ctrl) => ctrl.value.length == 0);
    if (index == -1)
      return this.participantsSignatureField.controls[
        this.participantsSignatureField.controls.length - 1
      ].patchValue(signature.toString('base64'));

    this.participantsSignatureField.controls[index].patchValue(signature.toString('base64'));
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
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
