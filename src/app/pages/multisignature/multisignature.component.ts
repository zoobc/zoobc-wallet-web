import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import zoobc, { isZBCAddressValid } from 'zoobc-sdk';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-multisignature',
  templateUrl: './multisignature.component.html',
  styleUrls: ['./multisignature.component.scss'],
})
export class MultisignatureComponent implements OnInit {
  @ViewChild('fileInput') myInputVariable: ElementRef;

  multiSigDrafts: MultiSigDraft[];
  form: FormGroup;
  txTypeField = new FormControl('sendMoney', Validators.required);
  chainTypeField = new FormControl('onchain', Validators.required);

  innerTransaction: boolean = false;
  signatures: boolean = false;

  txType = [
    { code: 'sendMoney', type: 'send money' },
    { code: 'registerNode', type: 'register node' },
    { code: 'updateNode', type: 'update node' },
    { code: 'removeNode', type: 'remove node' },
    { code: 'claimNode', type: 'claim node' },
    { code: 'setupDataset', type: 'setup account dataset' },
    { code: 'removeDataset', type: 'remove account dataset' },
    { code: 'escrowApproval', type: 'escrow approval' },
  ];

  isMultiSignature: boolean = false;
  account: SavedAccount;

  constructor(
    private router: Router,
    private multisigServ: MultisigService,
    private translate: TranslateService,
    private authServ: AuthService,
    private dialog: MatDialog
  ) {
    this.form = new FormGroup({
      txType: this.txTypeField,
      chainType: this.chainTypeField,
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
        const { multisigInfo, sendMoney, generatedSender } = draft;
        if (generatedSender == currAccount.address) return draft;
        if (multisigInfo.participants.includes(currAccount.address)) return draft;
        if (sendMoney && sendMoney.sender == currAccount.address) return draft;
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
    const txType = this.txTypeField.value;
    const multisig: MultiSigDraft = {
      accountAddress: '',
      fee: 0,
      id: 0,
      multisigInfo: null,
      unisgnedTransactions: null,
      [txType]: null,
    };
    if (this.chainTypeField.value == 'offchain') multisig.signaturesInfo = null;

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
      } else this.router.navigate(['/multisignature/create-transaction']);
    } else {
      this.multisigServ.update(multisig);
      this.router.navigate(['/multisignature/add-multisig-info']);
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
