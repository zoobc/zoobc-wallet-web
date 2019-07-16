import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';

import { KeyringService } from '../../services/keyring.service';
import { GetAddressFromPublicKey } from '../../../helpers/utils';
import { AccountService, SavedAccount } from 'src/app/services/account.service';
import { PinSetupDialogComponent } from 'src/app/components/pin-setup-dialog/pin-setup-dialog.component';

const coin = 'ZBC';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  @ViewChild('pinDialog') pinDialog: TemplateRef<any>;

  passphrase: string[];
  masterSeed: string;
  address: string;
  path: string;

  formTerms: FormGroup;
  isWrittenDown = new FormControl(false, Validators.required);
  isAgree = new FormControl(false, Validators.required);

  submitted = false;

  constructor(
    private router: Router,
    private accServ: AccountService,
    private keyringServ: KeyringService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.formTerms = new FormGroup({
      isWrittenDown: this.isWrittenDown,
      isAgree: this.isAgree,
    });
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.generateNewWallet();

    if (this.accServ.getCurrAccount()) this.router.navigateByUrl('/login');
  }

  generateNewWallet() {
    let { phrase: passphrase } = this.keyringServ.generateRandomPhrase();
    // let passphrase =
    //   'cause bicycle craft spike mention matter ensure fancy crisp climb lamp easily dish wedding tomorrow wing ancient flight man host river record joke cannon';
    const pass = 'p4ssphr4se';

    const { seed } = this.keyringServ.calcBip32RootKeyFromMnemonic(
      coin,
      passphrase,
      pass
    );

    const childSeed = this.keyringServ.calcForDerivationPathForCoin(coin, 0);
    this.address = GetAddressFromPublicKey(childSeed.publicKey);
    this.masterSeed = seed;
    this.passphrase = passphrase.split(' ');
  }

  copyPassphrase() {
    const passphrase = this.passphrase.join(' ');
    this.copyText(passphrase);
  }

  copyText(text) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackBar.open('Text Copied', null, { duration: 3000 });
  }

  openCreatePin() {
    let pinDialog = this.dialog.open(PinSetupDialogComponent, {
      width: '400px',
      disableClose: true,
    });
    pinDialog.afterClosed().subscribe(() => {
      this.saveNewAccount();
      this.router.navigateByUrl('/dashboard');
    });
  }

  saveNewAccount() {
    this.accServ.saveMasterSeed(this.masterSeed);
    const account: SavedAccount = {
      path: 0,
      name: 'Account 1',
    };
    this.accServ.addAccount(account);
  }
}
