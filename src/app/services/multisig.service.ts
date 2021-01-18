import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { getTranslation } from 'src/helpers/utils';
import Swal from 'sweetalert2';
import zoobc, { MultiSigInterface, TransactionType } from 'zbc-sdk';
import { AuthService, SavedAccount } from './auth.service';

export interface MultiSigDraft extends MultiSigInterface {
  id: number;
  generatedSender?: string;
  txType: number;
  txBody?: any;
}

@Injectable({
  providedIn: 'root',
})
export class MultisigService {
  private multisigTemplate: MultiSigDraft = {
    id: 0,
    accountAddress: null,
    fee: 0,
    txType: TransactionType.SENDMONEYTRANSACTION,
  };

  private sourceMultisig = new BehaviorSubject<MultiSigDraft>({ ...this.multisigTemplate });
  multisig = this.sourceMultisig.asObservable();

  constructor(private authServ: AuthService, private translate: TranslateService, private router: Router) {}

  initDraft(account: SavedAccount, txType: number) {
    const multisig: MultiSigDraft = {
      accountAddress: null,
      fee: 0,
      id: 0,
      multisigInfo: null,
      unisgnedTransactions: null,
      signaturesInfo: null,
      txType,
      txBody: {},
    };

    const isMultiSignature = account.type == 'multisig' ? true : false;
    if (isMultiSignature) {
      const accounts = this.authServ
        .getAllAccount()
        .filter(acc => account.participants.some(address => address.value == acc.address.value));

      // if no address on the participants
      if (accounts.length <= 0) {
        const message = getTranslation('you dont have any account that in participant list', this.translate);
        Swal.fire({ type: 'error', title: 'Oops...', text: message });
        return false;
      }

      multisig.multisigInfo = {
        minSigs: account.minSig,
        nonce: account.nonce,
        participants: account.participants,
      };

      const address = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);
      multisig.txBody.sender = address;

      this.update(multisig);
      this.router.navigate(['/multisignature/create/create-transaction']);
    } else {
      this.update(multisig);
      this.router.navigate(['/multisignature/create/add-multisig-info']);
    }
  }

  update(multisig: MultiSigDraft) {
    this.sourceMultisig.next(multisig);
  }

  getDrafts(): MultiSigDraft[] {
    return JSON.parse(localStorage.getItem('MULTISIG_DRAFTS'));
  }

  saveDraft() {
    let multisigDrafts = this.getDrafts();
    const len = multisigDrafts.length;
    if (this.sourceMultisig.value.id === 0) this.sourceMultisig.value.id = new Date().getTime();
    else {
      this.sourceMultisig.value.id = this.sourceMultisig.value.id;
    }
    multisigDrafts[len] = this.sourceMultisig.value;
    localStorage.setItem('MULTISIG_DRAFTS', JSON.stringify(multisigDrafts));
  }

  editDraft() {
    let multisigDrafts = this.getDrafts();

    for (let i = 0; i < multisigDrafts.length; i++) {
      const multisig = multisigDrafts[i];
      if (multisig.id == this.sourceMultisig.value.id) {
        multisigDrafts[i] = this.sourceMultisig.value;
        localStorage.setItem('MULTISIG_DRAFTS', JSON.stringify(multisigDrafts));
        break;
      }
    }
  }

  deleteDraft(idx: number) {
    let multisigDrafts = this.getDrafts();
    multisigDrafts = multisigDrafts.filter(draft => draft.id != idx);
    localStorage.setItem('MULTISIG_DRAFTS', JSON.stringify(multisigDrafts));
  }
}
