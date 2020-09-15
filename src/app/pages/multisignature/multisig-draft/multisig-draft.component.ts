import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import zoobc, { isZBCAddressValid } from 'zoobc-sdk';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-multisig-draft',
  templateUrl: './multisig-draft.component.html',
  styleUrls: ['./multisig-draft.component.scss'],
})
export class MultisigDraftComponent implements OnInit {
  multiSigDrafts: MultiSigDraft[];
  form: FormGroup;
  multisigInfoField = new FormControl(true);
  transactionField = new FormControl(false);
  signaturesField = new FormControl(false);
  @ViewChild('fileInput') myInputVariable: ElementRef;
  isMultiSignature: boolean = false;
  account: SavedAccount;

  constructor(
    private router: Router,
    private multisigServ: MultisigService,
    private translate: TranslateService,
    private authServ: AuthService
  ) {
    this.form = new FormGroup({
      multisigInfo: this.multisigInfoField,
      transaction: this.transactionField,
      signatures: this.signaturesField,
    });
    this.account = authServ.getCurrAccount();
    this.isMultiSignature = this.account.type == 'multisig' ? true : false;
  }

  ngOnInit() {
    this.getMultiSigDraft();
  }

  getMultiSigDraft() {
    const currAccount = this.authServ.getCurrAccount();
    this.multiSigDrafts = this.multisigServ
      .getDrafts()
      .filter(draft => {
        const { multisigInfo, transaction, generatedSender } = draft;
        if (generatedSender == currAccount.address) return draft;
        if (multisigInfo.participants.includes(currAccount.address)) return draft;
        if (transaction && transaction.sender == currAccount.address) return draft;
      })
      .sort()
      .reverse();
  }

  onEditDraft(idx: number) {
    let multisig: MultiSigDraft = this.multiSigDrafts[idx];
    multisig.unisgnedTransactions = Buffer.from(multisig.unisgnedTransactions || []);
    this.multisigServ.update(multisig);

    const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
    if (multisigInfo) this.router.navigate(['/multisignature/add-multisig-info']);
    else if (unisgnedTransactions) this.router.navigate(['/multisignature/create-transaction']);
    else if (signaturesInfo) this.router.navigate(['/multisignature/add-signatures']);
  }

  onNext() {
    const multisig: MultiSigDraft = {
      accountAddress: '',
      fee: 0,
      id: 0,
    };
    const { multisigInfo, transaction, signatures } = this.form.value;
    if (multisigInfo) multisig.multisigInfo = null;
    if (transaction) multisig.unisgnedTransactions = null;
    if (signatures) multisig.signaturesInfo = null;

    if (this.isMultiSignature) {
      multisig.multisigInfo = {
        minSigs: this.account.minSig,
        nonce: this.account.nonce,
        participants: this.account.participants,
      };
      const address = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);
      multisig.generatedSender = address;
      this.multisigServ.update(multisig);
      let isOneParticpants: boolean = false;
      const idx = this.authServ
        .getAllAccount()
        .filter(res => multisig.multisigInfo.participants.includes(res.address));
      if (idx.length > 0) isOneParticpants = true;
      else isOneParticpants = false;
      if (!isOneParticpants) {
        let message = getTranslation('you dont have any account that in participant list', this.translate);
        Swal.fire({ type: 'error', title: 'Oops...', text: message });
      } else {
        if (transaction) this.router.navigate(['/multisignature/create-transaction']);
        else if (signatures) this.router.navigate(['/multisignature/add-signatures']);
      }
    } else {
      this.multisigServ.update(multisig);

      if (multisigInfo) this.router.navigate(['/multisignature/add-multisig-info']);
      else if (transaction) this.router.navigate(['/multisignature/create-transaction']);
      else if (signatures) this.router.navigate(['/multisignature/add-signatures']);
    }
  }

  async onDeleteDraft(e, id: number) {
    e.stopPropagation();
    let sentence = getTranslation('are you sure want to delete?', this.translate, {
      alias: id,
    });
    Swal.fire({
      title: sentence,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.multisigServ.deleteDraft(id);
        this.getMultiSigDraft();
        return true;
      },
    });
  }

  getDate(pDate: number) {
    const newDate = new Date(pDate);
    return newDate;
  }

  openFile() {
    this.myInputVariable.nativeElement.click();
  }

  validationFile(file: any): file is MultiSigDraft {
    if ((file as MultiSigDraft).generatedSender !== undefined)
      return isZBCAddressValid((file as MultiSigDraft).generatedSender);
    return false;
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    if (file !== undefined) {
      fileReader.readAsText(file, 'JSON');
      fileReader.onload = async () => {
        let fileResult = JSON.parse(fileReader.result.toString());
        const validation = this.validationFile(fileResult);
        if (!validation) {
          let message = getTranslation('you imported the wrong file', this.translate);
          Swal.fire('Opps...', message, 'error');
        } else {
          this.multisigServ.update(fileResult);
          const listdraft = this.multisigServ.getDrafts();
          const checkExistDraft = listdraft.some(res => res.id === fileResult.id);

          if (checkExistDraft === true) {
            let message = getTranslation('there is same id in your draft', this.translate);
            Swal.fire('Opps...', message, 'error');
          } else {
            this.multisigServ.saveDraft();
            this.getMultiSigDraft();
            let message = getTranslation('draft saved', this.translate);
            let subMessage = getTranslation('your draft has been saved', this.translate);
            Swal.fire(message, subMessage, 'success');
          }
        }
      };
      fileReader.onerror = async err => {
        console.log(err);
        let message = getTranslation('an error occurred while processing your request', this.translate);
        Swal.fire('Opps...', message, 'error');
      };
    }
  }
}
