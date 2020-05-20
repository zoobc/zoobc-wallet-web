import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { ContactService } from 'src/app/services/contact.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-multisignature',
  templateUrl: './multisignature.component.html',
  styleUrls: ['./multisignature.component.scss'],
})
export class MultisignatureComponent implements OnInit {
  multiSigDrafts: MultiSigDraft[];
  isLoading: boolean;
  isError: boolean = false;

  form: FormGroup;
  multisigInfoField = new FormControl(false);
  transactionField = new FormControl(false);
  signaturesField = new FormControl(false);

  constructor(
    private router: Router,
    private multisigServ: MultisigService,
    private contactServ: ContactService,
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
    this.isError = false;
    this.isLoading = true;
    try {
      this.multiSigDrafts = this.multisigServ.getDrafts();
    } catch (error) {
      this.isError = true;
    }
    this.isLoading = false;
    this.isError = false;
  }

  getAlias(address: string): string {
    let alias = this.contactServ.get(address).alias || '';
    if (alias.length > 0) return `(${alias})`;
    return alias;
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

  async onDeleteDraft(id: number) {
    let sentence: string;
    await this.translate
      .get('Are you sure want to delete ?')
      .toPromise()
      .then((res) => (sentence = res));
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
}
