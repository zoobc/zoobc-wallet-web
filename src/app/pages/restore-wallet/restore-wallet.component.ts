import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { KeyringService } from 'src/app/services/keyring.service';
import { PinSetupDialogComponent } from 'src/app/components/pin-setup-dialog/pin-setup-dialog.component';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { MnemonicsService } from 'src/app/services/mnemonics.service';
import {
  TransactionService,
  Transactions,
} from 'src/app/services/transaction.service';
import { getAddressFromPublicKey } from 'src/helpers/utils';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

const coin = 'ZBC';

@Component({
  selector: 'app-restore-wallet',
  templateUrl: './restore-wallet.component.html',
  styleUrls: ['./restore-wallet.component.scss'],
})
export class RestoreWalletComponent implements OnInit {
  totalTx: number = 0;
  mnemonicWordLengtEnv: number = environment.mnemonicNumWords;

  restoreForm: FormGroup;
  passphraseField = new FormControl('', Validators.required);
  errorOpenWallet: boolean = false;

  word: string;
  wordField: FormArray;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private mnemonicServ: MnemonicsService,
    private transactionServ: TransactionService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.restoreForm = this.fb.group({
      words: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.onLoad24Passphrase('');
  }

  onLoad24Passphrase(phrase: any) {
    const phraseWord = phrase;
    for (let i = 0; i < this.mnemonicWordLengtEnv; i++) {
      this.wordField = this.restoreForm.get('words') as FormArray;
      this.wordField.push(
        this.fb.group({ word: [phraseWord[i], Validators.required] })
      );
    }
  }

  onPasteEvent(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let passphrase = clipboardData.getData('text').toLowerCase();
    let phraseWord = passphrase.split(' ');
    const valid = this.mnemonicServ.validateMnemonic(passphrase);
    if (phraseWord.length != this.mnemonicWordLengtEnv) {
      this.wordField.controls = [];
      this.onLoad24Passphrase(phraseWord);
      // Give some time for load passphrase after then set error
      setTimeout(() => {
        this.restoreForm.setErrors({ lengthMnemonic: true });
      }, 50);
    } else {
      if (!valid) {
        this.wordField.controls = [];
        this.onLoad24Passphrase(phraseWord);
        // Give some time for load passphrase after then set error
        setTimeout(() => {
          this.restoreForm.setErrors({ mnemonic: true });
        }, 50);
      } else {
        this.wordField.controls = [];
        this.onLoad24Passphrase(phraseWord);
      }
    }
  }

  backClicked() {
    this.router.navigate(['login']);
  }

  onClearClicked() {
    this.wordField.controls = [];
    this.onLoad24Passphrase('');
  }

  onChangeMnemonic() {
    let passphrase: string = this.restoreForm.value.words
      .map(form => form.word)
      .join(' ')
      .replace(/\s\s+/g, ' ')
      .toLowerCase();
    const valid = this.mnemonicServ.validateMnemonic(passphrase);
    if (!valid) this.restoreForm.setErrors({ mnemonic: true });
  }

  async onRestore() {
    if (this.restoreForm.valid) {
      if (localStorage.getItem('ENC_MASTER_SEED')) {
        let message: string;
        await this.translate
          .get('Your old wallet will be removed from this device')
          .toPromise()
          .then(res => (message = res));
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
      Swal.fire({
        allowOutsideClick: false,
        background: '#00000000',
        html: `<i class="fas fa-circle-notch fa-spin loader"></i>`,
        showConfirmButton: false,
        onBeforeOpen: () => this.saveNewAccount(key),
      });
    });
  }

  async saveNewAccount(key: string) {
    let passphrase: string = this.restoreForm.value.words
      .map(form => form.word)
      .join(' ')
      .replace(/\s\s+/g, ' ')
      .toLowerCase();

    const { seed } = this.keyringServ.calcBip32RootKeyFromMnemonic(
      coin,
      passphrase,
      'p4ssphr4se'
    );
    let masterSeed = seed;
    let publicKey: Uint8Array;
    let address: string;

    localStorage.removeItem('ACCOUNT');
    localStorage.removeItem('CURR_ACCOUNT');
    const childSeed = this.keyringServ.calcForDerivationPathForCoin(coin, 0);

    publicKey = childSeed.publicKey;
    address = getAddressFromPublicKey(publicKey);
    const account: SavedAccount = {
      name: 'Account 1',
      path: 0,
      nodeIP: null,
      address: address,
    };
    this.authServ.addAccount(account);
    this.authServ.savePassphraseSeed(passphrase, key);
    this.authServ.saveMasterSeed(masterSeed, key);
    this.authServ.login(key);
    Swal.close(); // for closing sweetalert loader
    this.router.navigate(['dashboard'], {
      state: { loadAccount: true },
    });
  }
}
