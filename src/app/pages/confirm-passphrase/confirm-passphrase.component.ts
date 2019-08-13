import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { environment } from '../../../environments/environment';
import { PinSetupDialogComponent } from 'src/app/components/pin-setup-dialog/pin-setup-dialog.component';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

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
  passphraseField = new FormControl('', Validators.required);

  mnemonicNumWords = environment.mnemonicNumWords;

  isMatched: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authServ: AuthService,
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

  prefillHalfPassphrase() {
    // removing half of the passphrase
    this.prefillPassphrase = this.passphrase;
    // let totalWordRemoved = 1;
    let totalWordRemoved = Math.round(this.mnemonicNumWords / 2);

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
      const wordField = <FormArray>this.confirmForm.controls['words'];
      wordField.push(
        this.fb.group({ word: [prefill[i], Validators.required] })
      );
    }
  }

  onConfirm() {
    if (this.confirmForm.valid) {
      let passphraseField: string = this.confirmForm.value.words
        .map(form => form.word)
        .join(' ')
        .replace(/\s\s+/g, ' ');

      if (passphraseField == this.words) {
        this.isMatched = true;
        this.openCreatePin();
      } else {
        this.isMatched = false;
      }
    }
  }

  openCreatePin() {
    let pinDialog = this.dialog.open(PinSetupDialogComponent, {
      width: '400px',
      disableClose: true,
    });
    pinDialog.afterClosed().subscribe((key: string) => {
      this.saveNewAccount(key);
      this.router.navigateByUrl('/dashboard');
    });
  }

  saveNewAccount(key: string) {
    this.authServ.saveMasterSeed(this.masterSeed, key);
    const account: SavedAccount = {
      path: 0,
      name: 'Account 1',
    };
    this.authServ.addAccount(account);
    this.authServ.login(account, key);
  }
}
