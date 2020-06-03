import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MultiSigInterface } from 'zoobc-sdk';

export interface MultiSigDraft extends MultiSigInterface {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class MultisigService {
  private multisigTemplate: MultiSigDraft = {
    id: 0,
    accountAddress: '',
    fee: 0,
  };

  private sourceMultisig = new BehaviorSubject<MultiSigDraft>({ ...this.multisigTemplate });
  multisig = this.sourceMultisig.asObservable();

  constructor() {}

  update(multisig: MultiSigDraft) {
    this.sourceMultisig.next(multisig);
  }

  getDrafts(): MultiSigDraft[] {
    return JSON.parse(localStorage.getItem('MULTISIG_DRAFTS'));
  }

  saveDraft() {
    let multisigDrafts = this.getDrafts();
    const len = multisigDrafts.length;
    this.sourceMultisig.value.id = new Date().getTime();
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
