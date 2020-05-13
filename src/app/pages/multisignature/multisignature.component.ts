import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';

@Component({
  selector: 'app-multisignature',
  templateUrl: './multisignature.component.html',
  styleUrls: ['./multisignature.component.scss'],
})
export class MultisignatureComponent implements OnInit {
  multiSigDrafts: any;
  isLoading: boolean;
  isError: boolean = false;

  form: FormGroup;
  multisigInfoField = new FormControl(false);
  transactionField = new FormControl(false);
  signaturesField = new FormControl(false);

  constructor(private router: Router, private multisigServ: MultisigService) {
    this.form = new FormGroup({
      multsigInfo: this.multisigInfoField,
      transaction: this.transactionField,
      signatures: this.signaturesField,
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.multiSigDrafts = [
      {
        sender: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
        senderAlias: 'John Doe',
        recipient: 'AFiTqqX99kYXjLFJJ2AWuzKK5zxYUT1Pn0p3s6lutkai',
        recipientAlias: 'Jane Doe',
        amount: 3,
      },
      {
        sender: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
        senderAlias: 'John Doe',
        recipient: 'AFiTqqX99kYXjLFJJ2AWuzKK5zxYUT1Pn0p3s6lutkai',
        recipientAlias: 'Jane Doe',
        amount: 4,
      },
      {
        sender: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
        senderAlias: 'John Doe',
        recipient: 'AFiTqqX99kYXjLFJJ2AWuzKK5zxYUT1Pn0p3s6lutkai',
        recipientAlias: 'Jane Doe',
        amount: 6,
      },
      {
        sender: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
        senderAlias: 'John Doe',
        recipient: 'AFiTqqX99kYXjLFJJ2AWuzKK5zxYUT1Pn0p3s6lutkai',
        recipientAlias: 'Jane Doe',
        amount: 7,
      },
      {
        sender: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
        senderAlias: 'John Doe',
        recipient: 'AFiTqqX99kYXjLFJJ2AWuzKK5zxYUT1Pn0p3s6lutkai',
        recipientAlias: 'Jane Doe',
        amount: 3,
      },
    ];
    this.isLoading = false;
    this.isError = false;
  }

  onNext() {
    const multisig: MultiSigDraft = {
      accountAddress: '',
      fee: 0,
      id: 0,
    };
    if (this.multisigInfoField.value) multisig.multisigInfo = null;
    if (this.transactionField.value) multisig.unisgnedTransactions = null;

    this.multisigServ.update(multisig);

    if (this.multisigInfoField.value) this.router.navigate(['/multisignature/add-multisig-info']);
    else if (this.transactionField.value) this.router.navigate(['/multisignature/create-transaction']);
  }

  onRefresh() {
    console.log('Refresh clicked');
  }
}
