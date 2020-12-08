import { Component, OnInit, ViewChild, ElementRef, Pipe, PipeTransform, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import zoobc, { isZBCAddressValid, parseAddress, TransactionType } from 'zoobc-sdk';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { createInnerTxBytes, getTxType } from 'src/helpers/multisig-utils';
import { MatDialog } from '@angular/material';
import { OffchainSignComponent } from './offchain-sign/offchain-sign.component';
import { saveAs } from 'file-saver';
import { AddParticipantsComponent } from './add-participants/add-participants.component';

@Component({
  selector: 'app-multisignature',
  templateUrl: './multisignature.component.html',
  styleUrls: ['./multisignature.component.scss'],
  entryComponents: [OffchainSignComponent],
})
export class MultisignatureComponent implements OnInit {
  @ViewChild('fileInput') myInputVariable: ElementRef;
  @ViewChild('menu') menu;

  multiSigDrafts: MultiSigDraft[];

  form: FormGroup;
  txTypeField = new FormControl(TransactionType.SENDMONEYTRANSACTION, Validators.required);
  chainTypeField = new FormControl('onchain', Validators.required);

  // innerTransaction: boolean = false;
  // signatures: boolean = false;

  draftSignedBy: number[] = [];
  draftTxType: string[] = [];

  show = false;

  txType = [
    { code: TransactionType.SENDMONEYTRANSACTION, type: 'send money' },
    { code: TransactionType.SETUPACCOUNTDATASETTRANSACTION, type: 'setup account dataset' },
    { code: TransactionType.REMOVEACCOUNTDATASETTRANSACTION, type: 'remove account dataset' },
    { code: TransactionType.APPROVALESCROWTRANSACTION, type: 'escrow approval' },
  ];

  constructor(
    private router: Router,
    private multisigServ: MultisigService,
    private translate: TranslateService,
    private authServ: AuthService,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute
  ) {
    this.form = new FormGroup({
      txType: this.txTypeField,
      chainType: this.chainTypeField,
    });

    // ========= Share signature from participant (url: /:txHash/:address/:signature)
    const txHash = this.activeRoute.snapshot.params['txHash'];
    const signature = this.activeRoute.snapshot.params['signature'];

    if (txHash && signature) {
      const address = parseAddress(this.activeRoute.snapshot.params['address']);
      const drafts = this.multisigServ.getDrafts();
      let draft = drafts.find(draft => draft.signaturesInfo.txHash == txHash);
      if (draft) {
        draft.signaturesInfo.participants.find(pcp => {
          if (pcp.address.value == address.value) {
            pcp.signature = Buffer.from(signature, 'base64');
            return true;
          }
        });
        this.onClickSignaturesList(undefined, draft);
      }
    }
    // ========= END: Share signature from participant (url: /:txHash/:address/:signature)
  }

  ngOnInit() {
    this.getMultiSigDraft();
    // console.log(ZBCAddressToBytes('ZTX_N5J5VIRA_V4B62XQS_G2756JRQ_ZY7Y5SSX_YSLK3QGY_J6OWLN4U_LGBY3D2R'));
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    event.stopPropagation();
    if (!this.menu.nativeElement.contains(event.target)) {
      this.show = false;
    }
  }

  getMultiSigDraft() {
    this.multiSigDrafts = this.multisigServ
      .getDrafts()
      .sort()
      .reverse();

    this.multiSigDrafts.forEach((draft, i) => {
      let total = 0;
      if (draft.signaturesInfo) {
        draft.signaturesInfo.participants.forEach(p => {
          total += Buffer.from(p.signature).length > 0 ? 1 : 0;
        });
      }
      this.draftSignedBy[i] = total;
      this.draftTxType[i] = getTxType(draft.txType);
    });
  }

  onClickDetail(draft: MultiSigDraft) {
    console.log(draft);

    const dialogRef = this.dialog.open(OffchainSignComponent, {
      width: '720px',
      maxHeight: '99vh',
      data: draft,
    });
    const instance = dialogRef.componentInstance;
    instance.withVerify = false;
  }

  onEditDraft(idx: number) {
    let multisig: MultiSigDraft = this.multiSigDrafts[idx];
    multisig.unisgnedTransactions = Buffer.from(multisig.unisgnedTransactions || []);
    this.multisigServ.update(multisig);

    const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
    if (multisigInfo) this.router.navigate(['/multisignature/create/add-multisig-info']);
    else if (unisgnedTransactions) this.router.navigate(['/multisignature/create/reate-transaction']);
    else if (signaturesInfo) this.router.navigate(['/multisignature/create/add-signatures']);
  }

  onNext() {
    const txType = this.txTypeField.value;
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

    const account = this.authServ.getCurrAccount();
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

      this.multisigServ.update(multisig);
      this.router.navigate(['/multisignature/create/create-transaction']);
    } else {
      this.multisigServ.update(multisig);
      this.router.navigate(['/multisignature/create/add-multisig-info']);
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

  openFile() {
    this.myInputVariable.nativeElement.value = '';
    this.myInputVariable.nativeElement.click();
  }

  validationFile(file: any): file is MultiSigDraft {
    if ((file as MultiSigDraft).txBody.sender !== undefined)
      return isZBCAddressValid((file as MultiSigDraft).txBody.sender);
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
          this.dialog.open(OffchainSignComponent, {
            width: '720px',
            maxHeight: '99vh',
            data: fileResult,
          });
        }
      };
      fileReader.onerror = async err => {
        console.log(err);
        let message = getTranslation('an error occurred while processing your request', this.translate);
        Swal.fire('Opps...', message, 'error');
      };
    }
  }

  onExport(e, draft: MultiSigDraft) {
    e.stopPropagation();
    let theJSON = JSON.stringify(draft);
    const blob = new Blob([theJSON], { type: 'application/JSON' });
    saveAs(blob, 'Multisignature-Draft.json');
  }

  onClickSignaturesList(e, draft: MultiSigDraft) {
    e && e.stopPropagation();
    const dialogRef = this.dialog.open(AddParticipantsComponent, {
      width: '400px',
      maxHeight: '99vh',
      data: draft,
    });
    dialogRef.afterClosed().subscribe(needUpdate => {
      if (needUpdate) this.getMultiSigDraft();
    });
  }

  onShow(e) {
    e.stopPropagation();
    this.show = !this.show;
  }
}
