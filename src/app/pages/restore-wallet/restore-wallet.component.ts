import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { AccountService, SavedAccount } from 'src/app/services/account.service';
import { KeyringService } from 'src/app/services/keyring.service';

const coin = 'ZBC';

@Component({
  selector: 'app-restore-wallet',
  templateUrl: './restore-wallet.component.html',
  styleUrls: ['./restore-wallet.component.scss'],
})
export class RestoreWalletComponent implements OnInit {
  @ViewChild('pinDialog') pinDialog: TemplateRef<any>;

  restoreForm: FormGroup;
  passphraseField = new FormControl('', Validators.required);

  formSetPin: FormGroup;
  pinForm = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern('^[0-9]*$'),
  ]);

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private accServ: AccountService,
    private keyringServ: KeyringService
  ) {
    this.restoreForm = new FormGroup({
      passphrase: this.passphraseField,
    });

    this.formSetPin = new FormGroup({
      pin: this.pinForm,
    });
  }

  ngOnInit() {}

  onRestore() {
    if (this.restoreForm.valid) {
      let pinDialog = this.dialog.open(this.pinDialog, {
        width: '400px',
        disableClose: true,
      });
      pinDialog.afterClosed().subscribe(() => {
        this.router.navigateByUrl('/dashboard');
      });
    }
  }

  onSetPin() {
    if (this.formSetPin.valid) {
      localStorage.setItem('pin', CryptoJS.SHA256(this.pinForm.value));
      this.saveNewAccount();

      this.dialog.closeAll();
    }
  }

  saveNewAccount() {
    const passphrase = this.passphraseField.value;

    const { seed } = this.keyringServ.calcBip32RootKeyFromMnemonic(
      coin,
      passphrase,
      'p4ssphr4se'
    );
    let masterSeed = seed;

    const account: SavedAccount = {
      name: 'Account 1',
      path: 0,
      imported: false,
    };

    this.accServ.saveMasterSeed(masterSeed);
    this.accServ.addAccount(account);
    this.router.navigateByUrl('/dashboard');
  }
}
