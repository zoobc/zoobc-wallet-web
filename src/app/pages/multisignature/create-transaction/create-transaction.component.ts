import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { getTranslation, stringToBuffer } from 'src/helpers/utils';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { generateTransactionHash, TransactionType } from 'zoobc-sdk';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { createInnerTxBytes, createInnerTxForm, getInputMap } from 'src/helpers/multisig-utils';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss'],
})
export class CreateTransactionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chainDialog') chainDialog: TemplateRef<any>;
  accountRefDialog: MatDialogRef<any>;

  minFee = environment.fee;

  createTransactionForm: FormGroup;
  form: FormGroup;
  chainTypeField = new FormControl('onchain', Validators.required);

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  stepper = {
    multisigInfo: false,
    signatures: false,
  };

  fieldList: object;

  readonlyInput: boolean = false;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private authServ: AuthService,
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
      const { multisigInfo, unisgnedTransactions, signaturesInfo, txBody } = multisig;
      if (unisgnedTransactions === undefined) this.router.navigate(['/multisignature']);

      this.multisig = multisig;
      if (signaturesInfo && signaturesInfo.txHash) this.readonlyInput = true;

      const senderForm = this.createTransactionForm.get('sender');
      senderForm.setValue(multisig.generatedSender);

      if (txBody) this.createTransactionForm.patchValue(txBody);
      this.stepper.multisigInfo = multisigInfo !== undefined ? true : false;
      this.stepper.signatures = signaturesInfo !== undefined ? true : false;
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  async generateDownloadJsonUri() {
    const { signaturesInfo } = this.multisig;
    if (signaturesInfo === null) {
      this.updateCreateTransaction();
      const title = getTranslation('are you sure?', this.translate);
      const message = getTranslation('you will not be able to update the form anymore!', this.translate);
      const buttonText = getTranslation('yes, continue it!', this.translate);
      const isConfirm = await Swal.fire({
        title: title,
        text: message,
        showCancelButton: true,
        confirmButtonText: buttonText,
        type: 'warning',
      }).then(result => {
        if (result.value) {
          this.generatedTxHash();
          this.readonlyInput = true;
          return true;
        } else return false;
      });
      if (!isConfirm) return false;
    }

    let theJSON = JSON.stringify(this.multisig);
    const blob = new Blob([theJSON], { type: 'application/JSON' });
    saveAs(blob, 'Multisignature-Draft.json');
  }

  ngOnDestroy() {
    if (this.multisigSubs) this.multisigSubs.unsubscribe();
  }

  async next() {
    try {
      if (this.multisig.signaturesInfo !== null) this.readonlyInput = false;

      // const amountForm = this.createTransactionForm.get('amount');
      // const feeForm = this.createTransactionForm.get('fee');
      // const senderForm = this.createTransactionForm.get('sender');

      // const total = amountForm.value + feeForm.value;
      // const balance = await zoobc.Account.getBalance(senderForm.value).then(
      //   (res: AccountBalanceResponse) => parseInt(res.accountbalance.spendablebalance) / 1e8
      // );
      // if (balance < total) {
      //   const message = getTranslation('your balances are not enough for this transaction', this.translate);
      //   return Swal.fire({ type: 'error', title: 'Oops...', text: message });
      // }
      if (this.createTransactionForm.valid) {
        this.updateCreateTransaction();
        const { signaturesInfo } = this.multisig;
        if (signaturesInfo === null) {
          const title = getTranslation('are you sure?', this.translate);
          const message = getTranslation('you will not be able to update the form anymore!', this.translate);
          const buttonText = getTranslation('yes, continue it!', this.translate);

          const isConfirm = await Swal.fire({
            title: title,
            text: message,
            showCancelButton: true,
            confirmButtonText: buttonText,
            type: 'warning',
          }).then(result => {
            if (result.value) {
              this.generatedTxHash();
              this.multisigServ.update(this.multisig);
              return true;
            } else return false;
          });
          if (!isConfirm) return false;
        }

        if (signaturesInfo === undefined) this.router.navigate(['/multisignature/send-transaction']);
        else this.router.navigate(['/multisignature/add-signatures']);
      }
    } catch (err) {
      console.log(err);
      let message = getTranslation(err.message, this.translate);
      return Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  saveDraft() {
    this.updateCreateTransaction();
    if (this.multisig.id) this.multisigServ.editDraft();
    else this.multisigServ.saveDraft();
    this.router.navigate(['/multisignature']);
  }

  updateCreateTransaction() {
    const multisig = { ...this.multisig };
    multisig.txBody = this.createTransactionForm.value;
    this.multisigServ.update(multisig);
  }

  onNext() {
    this.accountRefDialog = this.dialog.open(this.chainDialog, {
      width: '380px',
      maxHeight: '90vh',
    });
  }

  async onSelectedChain() {
    console.log(this.chainTypeField.value);
    if (this.chainTypeField.value == 'onchain') {
      this.updateCreateTransaction();
      this.router.navigate(['/multisignature/send-transaction']);
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
      }).then(result => {
        if (result.value) {
          this.generatedTxHash();
          this.readonlyInput = true;
          return true;
        } else return false;
      });
      if (!isConfirm) return false;

      this.saveDraft();
    }
    this.accountRefDialog.close();
  }

  back() {
    this.location.back();
  }

  generatedTxHash() {
    const { unisgnedTransactions, multisigInfo, signaturesInfo, txType } = this.multisig;
    const form = this.createTransactionForm.value;
    const signature = stringToBuffer('');

    if (unisgnedTransactions === null) this.multisig.unisgnedTransactions = createInnerTxBytes(form, txType);

    if (signaturesInfo !== undefined) {
      const txHash = generateTransactionHash(this.multisig.unisgnedTransactions);
      const participants = multisigInfo.participants.map(address => ({ address, signature }));
      this.multisig.signaturesInfo = { txHash, participants };
    }
  }
}
