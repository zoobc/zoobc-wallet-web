import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { KeyringService } from '../../services/keyring.service';
import { onCopyText } from '../../../helpers/utils';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

const coin = 'ZBC';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  passphrase: string[];
  masterSeed: string;

  formTerms: FormGroup;
  isWrittenDown = new FormControl(false, Validators.required);
  isAgree = new FormControl(false, Validators.required);

  constructor(
    private router: Router,
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private snackbar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.formTerms = new FormGroup({
      isWrittenDown: this.isWrittenDown,
      isAgree: this.isAgree,
    });
  }

  ngOnInit() {
    if (history.state.passphrase) {
      this.passphrase = history.state.passphrase;
      this.masterSeed = history.state.masterSeed;
      this.isWrittenDown.patchValue(true);
      this.isAgree.patchValue(true);
    } else {
      this.generateNewWallet();
    }
  }

  generateNewWallet() {
    let { phrase: passphrase } = this.keyringServ.generateRandomPhrase();
    const pass = 'p4ssphr4se';

    const { seed } = this.keyringServ.calcBip32RootKeyFromMnemonic(
      coin,
      passphrase,
      pass
    );

    this.masterSeed = seed;
    this.passphrase = passphrase.split(' ');
  }

  async copyPassphrase() {
    const passphrase = this.passphrase.join(' ');
    onCopyText(passphrase);

    let message: string;
    await this.translate
      .get('Passphrase Copied')
      .toPromise()
      .then(res => (message = res));
    this.snackbar.open(message, null, { duration: 3000 });
  }

  goToConfirmPage() {
    this.router.navigate(['confirm-passphrase'], {
      state: { masterSeed: this.masterSeed, passphrase: this.passphrase },
    });
  }
}
