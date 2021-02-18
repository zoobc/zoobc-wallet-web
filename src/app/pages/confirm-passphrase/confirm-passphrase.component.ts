import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { PinSetupDialogComponent } from 'src/app/components/pin-setup-dialog/pin-setup-dialog.component';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import zoobc, { ZooKeyring, getZBCAddress } from 'zbc-sdk';
import { Location } from '@angular/common';

@Component({
  selector: 'app-confirm-passphrase',
  templateUrl: './confirm-passphrase.component.html',
  styleUrls: ['./confirm-passphrase.component.scss'],
})
export class ConfirmPassphraseComponent implements OnInit {
  words: string;
  passphrase: string[];
  prefillPassphrase: string[];

  confirmForm: FormGroup;
  wordField: FormArray;
  zooKeyring: ZooKeyring;

  mnemonicNumWords = environment.mnemonicNumWords;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authServ: AuthService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    if (!history.state.passphrase) {
      this.location.replaceState('signup');
      this.location.back();

      this.confirmForm = this.fb.group({ words: this.fb.array([]) });
    } else {
      this.words = history.state.passphrase.join(' ');
      this.passphrase = Object.assign([], history.state.passphrase);
      this.prefillHalfPassphrase();
    }
  }

  backClicked() {
    this.location.back();
  }

  prefillHalfPassphrase() {
    // removing some words of the passphrase
    this.prefillPassphrase = this.passphrase;
    // let totalWordRemoved = 1;
    let totalWordRemoved = Math.round(this.mnemonicNumWords / 6);

    for (let i = 0; i < totalWordRemoved; i++) {
      let lenWords = this.prefillPassphrase.length;
      let random: number;
      do {
        random = Math.floor(Math.random() * (lenWords - 1));
      } while (this.prefillPassphrase[random] == '');

      this.prefillPassphrase[random] = '';
    }

    // create array form
    this.confirmForm = this.fb.group({
      words: this.fb.array([]),
    });

    // fill the form with the prefilled passphrase
    const prefill = this.prefillPassphrase;
    for (let i = 0; i < this.mnemonicNumWords; i++) {
      this.wordField = <FormArray>this.confirmForm.controls['words'];
      this.wordField.push(this.fb.group({ word: [prefill[i], Validators.required] }));
    }
  }

  isValid() {
    if (this.wordField.valid) {
      let passphraseField: string = this.confirmForm.value.words
        .map(form => form.word)
        .join(' ')
        .replace(/\s\s+/g, ' ')
        .toLowerCase();

      if (passphraseField != this.words) this.confirmForm.setErrors({ mnemonic: true });
    } else this.confirmForm.setErrors({ required: true });
  }

  openCreatePin() {
    if (this.confirmForm.valid) {
      let pinDialog = this.dialog.open(PinSetupDialogComponent, {
        width: '400px',
        disableClose: true,
      });
      pinDialog.afterClosed().subscribe((key: string) => {
        this.saveNewAccount(key);
        this.router.navigateByUrl('/dashboard');
      });
    }
  }

  saveNewAccount(key: string) {
    this.zooKeyring = new ZooKeyring(this.words);

    const encPassphrase = zoobc.Wallet.encryptPassphrase(this.words, key);
    const childSeed = this.zooKeyring.calcDerivationPath(0);
    const accountAddress = getZBCAddress(childSeed.publicKey);

    const account: SavedAccount = {
      name: 'Account 1',
      type: 'normal',
      path: 0,
      nodeIP: null,
      address: { value: accountAddress, type: 0 },
    };

    const net = environment.production ? 'MAIN' : 'TEST';
    localStorage.removeItem(`ACCOUNT_${net}`);
    localStorage.setItem(`ENC_PASSPHRASE_SEED_${net}`, encPassphrase);
    localStorage.setItem(`ACCOUNT_${net}`, JSON.stringify([account]));
    localStorage.setItem(`CURR_ACCOUNT_${net}`, JSON.stringify(account));
    localStorage.setItem('IS_RESTORED', 'false');

    this.authServ.login(key);
  }
}
