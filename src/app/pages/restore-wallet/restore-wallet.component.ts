import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { PinSetupDialogComponent } from 'src/app/components/pin-setup-dialog/pin-setup-dialog.component';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import zoobc, { ZooKeyring, getZBCAdress } from 'zoobc-sdk';

interface Languages {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-restore-wallet',
  templateUrl: './restore-wallet.component.html',
  styleUrls: ['./restore-wallet.component.scss'],
})
export class RestoreWalletComponent implements OnInit {
  languages: Languages[] = [
    { value: 'chinese_simplified', viewValue: 'Chinese Simplified' },
    { value: 'english', viewValue: 'English' },
    { value: 'japanese', viewValue: 'Japanese' },
    { value: 'spanish', viewValue: 'Spanish' },
    { value: 'italian', viewValue: 'Italian' },
    { value: 'french', viewValue: 'French' },
    { value: 'korean', viewValue: 'Korean' },
    { value: 'chinese_traditional', viewValue: 'Chinese Traditional' },
  ];

  selectedLang: number = 1;
  mnemonicNumWords = environment.mnemonicNumWords;

  restoreForm: FormGroup;
  passphraseField = new FormControl('', Validators.required);
  errorOpenWallet: boolean = false;

  wordField: FormArray;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authServ: AuthService,
    private fb: FormBuilder
  ) {
    this.restoreForm = this.fb.group({ words: this.fb.array([]) });
  }

  ngOnInit() {
    this.onLoad24Passphrase();
  }

  onLoad24Passphrase(phrase: string[] = []) {
    for (let i = 0; i < this.mnemonicNumWords; i++) {
      this.wordField = this.restoreForm.get('words') as FormArray;
      this.wordField.push(this.fb.group({ word: [phrase[i], Validators.required] }));
    }
  }

  validatePassphrase(passphrase: string) {
    const arrayPhrase = passphrase.split(' ');
    const lang = this.languages[this.selectedLang].value;
    const valid = ZooKeyring.isPassphraseValid(passphrase, lang);

    this.wordField.controls = [];
    this.onLoad24Passphrase(arrayPhrase);
    if (!valid) {
      setTimeout(() => {
        this.restoreForm.setErrors({ mnemonic: true });
      }, 50);
    }
  }

  selectMnemonicLanguage(index: number) {
    let passphrase: string = this.restoreForm.value.words.map(form => form.word).join(' ');
    this.selectedLang = index;
    this.validatePassphrase(passphrase);
  }

  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let passphrase = clipboardData.getData('text').toLowerCase();
    this.validatePassphrase(passphrase);
  }

  onClearPassphrase() {
    this.wordField.controls = [];
    this.onLoad24Passphrase();
  }

  onChangeMnemonic() {
    let passphrase: string = this.restoreForm.value.words.map(form => form.word).join(' ');
    const lang = this.languages[this.selectedLang].value;
    const valid = ZooKeyring.isPassphraseValid(passphrase, lang);
    if (!valid) this.restoreForm.setErrors({ mnemonic: true });
  }

  async onRestore() {
    if (this.restoreForm.valid) {
      if (localStorage.getItem('ENC_MASTER_SEED')) {
        let message: string = 'Your old wallet will be removed from this device';
        Swal.fire({
          title: message,
          confirmButtonText: 'Continue',
          showCancelButton: true,
          showLoaderOnConfirm: true,
          preConfirm: () => {
            this.openPinDialog();
            return true;
          },
        });
      } else this.openPinDialog();
    }
  }

  openPinDialog() {
    let pinDialog = this.dialog.open(PinSetupDialogComponent, {
      width: '400px',
      disableClose: true,
    });
    pinDialog.afterClosed().subscribe((key: string) => {
      this.saveNewAccount(key);
    });
  }

  async saveNewAccount(key: string) {
    let passphrase: string = this.restoreForm.value.words.map(form => form.word).join(' ');

    const encPassphrase = zoobc.Wallet.encryptPassphrase(passphrase, key);
    const keyring = new ZooKeyring(passphrase);
    const childSeed = keyring.calcDerivationPath(0);
    const address = getZBCAdress(childSeed.publicKey);
    const account: SavedAccount = {
      name: 'Account 1',
      path: 0,
      type: 'normal',
      nodeIP: null,
      address: address,
    };

    localStorage.removeItem('ACCOUNT');
    localStorage.removeItem('CURR_ACCOUNT');
    localStorage.setItem('ENC_PASSPHRASE_SEED', encPassphrase);
    localStorage.setItem('ACCOUNT', JSON.stringify([account]));
    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));

    this.authServ.login(key);
    this.router.navigate(['dashboard'], {
      state: { loadAccount: true },
    });
  }
}
