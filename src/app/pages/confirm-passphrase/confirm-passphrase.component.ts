import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { PinSetupDialogComponent } from 'src/app/components/pin-setup-dialog/pin-setup-dialog.component';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { KeyringService } from 'src/app/services/keyring.service';
import { getAddressFromPublicKey } from 'src/helpers/utils';
import { ZooKeyring } from 'zoobc-sdk';

const coin = 'ZBC';
@Component({
  selector: 'app-confirm-passphrase',
  templateUrl: './confirm-passphrase.component.html',
  styleUrls: ['./confirm-passphrase.component.scss'],
})
export class ConfirmPassphraseComponent implements OnInit {
  words: string;
  passphrase: string[];
  prefillPassphrase: string[];

  masterSeed: string;

  confirmForm: FormGroup;
  wordField: FormArray;
  zooKeyring;

  mnemonicNumWords = environment.mnemonicNumWords;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private router: Router
  ) {
    if (!history.state.passphrase) router.navigateByUrl('/signup');

    this.words = history.state.passphrase.join(' ');
    this.passphrase = Object.assign([], history.state.passphrase);
    this.masterSeed = history.state.masterSeed;
  }

  ngOnInit() {
    this.prefillHalfPassphrase();
  }

  backClicked() {
    this.router.navigate(['signup'], {
      state: {
        masterSeed: history.state.masterSeed,
        passphrase: history.state.passphrase,
      },
    });
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
      this.wordField.push(
        this.fb.group({ word: [prefill[i], Validators.required] })
      );
    }
  }

  isValid() {
    if (this.wordField.valid) {
      let passphraseField: string = this.confirmForm.value.words
        .map(form => form.word)
        .join(' ')
        .replace(/\s\s+/g, ' ')
        .toLowerCase();

      if (passphraseField != this.words)
        this.confirmForm.setErrors({ mnemonic: true });
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
    const pass = 'p4ssphr4se';
    this.zooKeyring = new ZooKeyring(this.words, pass);

    const childSeed = this.zooKeyring.calcDerivationPath(0);
    const accountAddress = getAddressFromPublicKey(childSeed.publicKey);
    this.authServ.saveMasterSeed(this.masterSeed, key);
    this.authServ.savePassphraseSeed(this.words, key);
    const account: SavedAccount = {
      name: 'Account 1',
      path: 0,
      nodeIP: null,
      address: accountAddress,
    };
    localStorage.removeItem('ACCOUNT');
    this.authServ.addAccount(account);
    this.authServ.login(key);
  }
}
