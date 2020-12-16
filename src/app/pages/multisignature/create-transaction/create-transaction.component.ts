import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { getTranslation, stringToBuffer } from 'src/helpers/utils';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { generateTransactionHash } from 'zbc-sdk';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { createInnerTxBytes, createInnerTxForm, getInputMap } from 'src/helpers/multisig-utils';
import { MatDialog, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
})
export class CreateTransactionComponent implements OnInit, OnDestroy {
  @ViewChild('chainDialog') chainDialog: TemplateRef<any>;
  chainRefDialog: MatDialogRef<any>;

  createTransactionForm: FormGroup;

  form: FormGroup;
  chainTypeField = new FormControl('onchain', Validators.required);

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  fieldList: object;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    const subs = this.multisigServ.multisig.subscribe(multisig => {
      this.createTransactionForm = createInnerTxForm(multisig.txType);
      this.fieldList = getInputMap(multisig.txType);
    });
    subs.unsubscribe();

    this.form = new FormGroup({
      chainType: this.chainTypeField,
    });
  }

  ngOnInit() {
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { unisgnedTransactions, txBody } = multisig;
      if (unisgnedTransactions === undefined) this.router.navigate(['/multisignature']);

      this.multisig = multisig;

      const senderForm = this.createTransactionForm.get('sender');
      senderForm.setValue(multisig.txBody.sender);
      if (txBody) this.createTransactionForm.patchValue(txBody);
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.multisigSubs) this.multisigSubs.unsubscribe();
  }

  saveDraft() {
    this.updateCreateTransaction();
    this.multisigServ.saveDraft();
    this.router.navigate(['/multisignature']);
  }

  updateCreateTransaction() {
    const multisig = { ...this.multisig };
    multisig.txBody = this.createTransactionForm.value;
    this.multisigServ.update(multisig);
  }

  onNext() {
    this.chainRefDialog = this.dialog.open(this.chainDialog, {
      width: '380px',
      maxHeight: '90vh',
    });
  }

  async onSelectedChain() {
    if (this.chainTypeField.value == 'onchain') {
      this.updateCreateTransaction();
      this.router.navigate(['/multisignature/create/send-transaction']);
    } else if (this.chainTypeField.value == 'offchain') {
      const title = getTranslation('are you sure?', this.translate);
      const message = getTranslation('you will not be able to update the form anymore!', this.translate);
      const buttonText = getTranslation('yes, continue it!', this.translate);
      const isConfirm = await Swal.fire({
        title: title,
        text: message,
        showCancelButton: true,
        confirmButtonText: buttonText,
        type: 'warning',
      }).then(result => result.value);
      if (!isConfirm) return false;

      this.generateTxHash();
      this.saveDraft();
    }
    this.chainRefDialog.close();
  }

  back() {
    this.location.back();
  }

  generateTxHash() {
    const { multisigInfo, txType } = this.multisig;
    const form = this.createTransactionForm.value;
    const signature = stringToBuffer('');
    const unisgnedTransactions = createInnerTxBytes(form, txType);
    const txHash = generateTransactionHash(unisgnedTransactions);
    const participants = multisigInfo.participants.map(address => ({ address, signature }));

    this.multisig.unisgnedTransactions = unisgnedTransactions;
    this.multisig.signaturesInfo = { txHash, participants };
  }
}
