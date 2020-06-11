import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-multisignature',
  templateUrl: './multisignature.component.html',
  styleUrls: ['./multisignature.component.scss'],
})
export class MultisignatureComponent implements OnInit {
  multiSigDrafts: MultiSigDraft[];

  form: FormGroup;
  multisigInfoField = new FormControl(false);
  transactionField = new FormControl(false);
  signaturesField = new FormControl(false);
  @ViewChild('fileInput') myInputVariable: ElementRef;

  constructor(
    private router: Router,
    private multisigServ: MultisigService,
    private translate: TranslateService
  ) {
    this.form = new FormGroup({
      multisigInfo: this.multisigInfoField,
      transaction: this.transactionField,
      signatures: this.signaturesField,
    });
  }

  ngOnInit() {
    this.getMultiSigDraft();
  }

  getMultiSigDraft() {
    this.multiSigDrafts = this.multisigServ.getDrafts();
  }

  onEditDraft(idx: number) {
    const multisig: MultiSigDraft = this.multiSigDrafts[idx];
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

    this.multisigServ.update(multisig);

    if (multisigInfo) this.router.navigate(['/multisignature/add-multisig-info']);
    else if (transaction) this.router.navigate(['/multisignature/create-transaction']);
    else if (signatures) this.router.navigate(['/multisignature/add-signatures']);
  }

  async onDeleteDraft(e, id: number) {
    e.stopPropagation();
    let sentence: string;
    await this.translate
      .get('Are you sure want to delete?')
      .toPromise()
      .then(res => (sentence = res));
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

  onRefresh() {
    this.getMultiSigDraft();
  }

  openFile() {
    this.myInputVariable.nativeElement.click();
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    if (file !== undefined) {
      fileReader.readAsText(file, 'JSON');
      fileReader.onload = async () => {
        let fileResult = JSON.parse(fileReader.result.toString());
        this.multisigServ.update(fileResult);
        const listdraft = this.multisigServ.getDrafts();
        const checkExistDraft = listdraft.some(res => {
          if (res.id === fileResult.id) return true;
          else return false;
        });
        if (checkExistDraft === true) {
          let message: string;
          await this.translate
            .get('There is same id in your draft')
            .toPromise()
            .then(res => (message = res));
          Swal.fire('Opps...', message, 'error');
        } else {
          this.multisigServ.saveDraft();
          this.onRefresh();
          let message: string;
          await this.translate
            .get('Draft Saved')
            .toPromise()
            .then(res => (message = res));
          let subMessage: string;
          await this.translate
            .get('Your Draft has been saved')
            .toPromise()
            .then(res => (message = res));
          Swal.fire(message, subMessage, 'success');
        }
      };
      fileReader.onerror = async err => {
        console.log(err);
        let message: string;
        await this.translate
          .get('An error occurred while processing your request')
          .toPromise()
          .then(res => (message = res));
        Swal.fire('Opps...', message, 'error');
      };
    }
  }
}
