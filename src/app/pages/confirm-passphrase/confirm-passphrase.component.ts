import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PinSetupDialogComponent } from 'src/app/components/pin-setup-dialog/pin-setup-dialog.component';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import zoobc, { ZooKeyring, getZBCAddress } from 'zoobc-sdk';
import { Location } from '@angular/common';

@Component({
  selector: 'app-confirm-passphrase',
  templateUrl: './confirm-passphrase.component.html',
  styleUrls: ['./confirm-passphrase.component.scss'],
})
export class ConfirmPassphraseComponent implements OnInit {
  @ViewChildren('firstInput') firstInput: ElementRef;

  words: string;
  passphrase: string[];
  zooKeyring: ZooKeyring;
  confirmForm: FormGroup;
  firstIndex: number;
  secondIndex: number;
  firstWord: FormControl = new FormControl('', Validators.required);
  secondWord: FormControl = new FormControl('', Validators.required);

  constructor(
    private dialog: MatDialog,
    private authServ: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.confirmForm = new FormGroup({
      firstWord: this.firstWord,
      secondWord: this.secondWord,
    });
  }

  ngOnInit() {
    if (!history.state.passphrase) {
      this.location.replaceState('signup');
      this.location.back();
    } else {
      this.words = history.state.passphrase.join(' ');
      this.passphrase = Object.assign([], history.state.passphrase);
      this.randomPassPhrase();
    }
  }

  backClicked() {
    this.location.back();
  }

  randomPassPhrase() {
    let lenWords = this.passphrase.length;
    const first = Math.floor(Math.random() * (lenWords - 1));
    const second = Math.floor(Math.random() * (lenWords - 1));
    this.firstIndex = first;
    this.secondIndex = second;
    if (first > second) {
      this.firstIndex = second;
      this.secondIndex = first;
    }
  }

  checkValid() {
    if (!this.confirmForm.valid) return this.confirmForm.setErrors({ required: true });
    if (
      this.firstWord.value.replace(/\s/g, '').toLowerCase() !== this.passphrase[this.firstIndex] ||
      this.secondWord.value.replace(/\s/g, '').toLowerCase() !== this.passphrase[this.secondIndex]
    ) {
      this.confirmForm.setErrors({ mnemonic: true });
    }
  }

  openCreatePin() {
    if (this.confirmForm.valid) {
      let pinDialog = this.dialog.open(PinSetupDialogComponent, {
        width: '400px',
        maxHeight: '90vh',
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

    localStorage.removeItem('ACCOUNT');
    localStorage.setItem('ENC_PASSPHRASE_SEED', encPassphrase);
    localStorage.setItem('ACCOUNT', JSON.stringify([account]));
    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
    localStorage.setItem('IS_RESTORED', 'false');

    this.authServ.login(key);
  }

  clearInput(name: string) {
    this.confirmForm.get(name).reset();
  }
}
