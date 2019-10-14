import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
import { GetAddressFromPublicKey } from 'src/helpers/utils';
import { environment } from 'src/environments/environment';

const coin = 'ZBC';

@Component({
  selector: 'app-restore-wallet',
  templateUrl: './restore-wallet.component.html',
  styleUrls: ['./restore-wallet.component.scss'],
})
export class RestoreWalletComponent implements OnInit {
  @ViewChild('pinDialog') pinDialog: TemplateRef<any>;
  listAccount = [];
  listAccountTemp = [];
  totalTx: number = 0;
  mnemonicWordLengtEnv: number = environment.mnemonicNumWords;

  restoreForm: FormGroup;
  passphraseField = new FormControl('', Validators.required);
  errorOpenWallet: boolean = false;
  private key: string;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private mnemonicServ: MnemonicsService,
    private transactionServ: TransactionService
  ) {
    this.restoreForm = new FormGroup({
      passphrase: this.passphraseField,
    });
  }

  ngOnInit() {}

  onChangeMnemonic() {
    const valid = this.mnemonicServ.validateMnemonic(
      this.passphraseField.value
    );
    const mnemonicNumLength = this.passphraseField.value.split(' ').length;
    if (mnemonicNumLength != this.mnemonicWordLengtEnv) {
      this.passphraseField.setErrors({ lengthMnemonic: true });
    }
    if (!valid) this.passphraseField.setErrors({ mnemonic: true });
  }

  onRestore() {
    if (this.restoreForm.valid) {
      if (localStorage.getItem('ENC_MASTER_SEED')) {
        Swal.fire({
          title: 'Your old wallet will be removed from this device',
          confirmButtonText: 'Continue',
          showCancelButton: true,
          showLoaderOnConfirm: true,
          preConfirm: () => {
            this.openPinDialog();
            return true;
          },
        });
      } else {
        this.openPinDialog();
      }
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
        onBeforeOpen: () => {
          Swal.showLoading();
          this.saveNewAccount(key);
        },
      });
      this.key = key;
    });
  }

  async saveNewAccount(key: string) {
    this.errorOpenWallet = false;
    const passphrase = this.passphraseField.value;

    const { seed } = this.keyringServ.calcBip32RootKeyFromMnemonic(
      coin,
      passphrase,
      'p4ssphr4se'
    );
    let masterSeed = seed;
    let accountName: string = 'Account ';
    let accountNo: number = 1;
    let accountPath: number = 0;
    let publicKey: Uint8Array;
    let address: string;

    let counter: number = 0;

    while (counter < 20) {
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(
        coin,
        accountPath
      );

      publicKey = childSeed.publicKey;
      address = GetAddressFromPublicKey(publicKey);

      const listAccounts = {
        name: accountName + accountNo,
        path: accountPath,
        nodeIP: null,
        address: address,
      };

      let checkHasTransaction = await this.transactionServ
        .getAccountTransaction(1, 1, address)
        .then((res: Transactions) => {
          this.totalTx = res.total;
          this.listAccountTemp.push(listAccounts);
          if (this.totalTx > 0) {
            Array.prototype.push.apply(this.listAccount, this.listAccountTemp);
            this.authServ.restoreAccount(this.listAccount);
            this.listAccountTemp = [];
            counter = 0;
          }
        })
        .catch(() => {
          counter = 20;
          this.errorOpenWallet = true;
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!',
            type: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Try Again',
          }).then(result => {
            if (result.value == true) {
              Swal.fire({
                allowOutsideClick: false,
                background: '#00000000',
                onBeforeOpen: () => {
                  Swal.showLoading();
                  this.saveNewAccount(this.key);
                },
              });
            }
          });
        });
      accountPath++;
      accountNo++;
      counter++;
    }
    // if account dont have any transaction yet
    if (this.listAccount.length === 0) {
      localStorage.removeItem('ACCOUNT');
      localStorage.removeItem('CURR_ACCOUNT');
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(
        coin,
        accountPath
      );

      publicKey = childSeed.publicKey;
      address = GetAddressFromPublicKey(publicKey);
      const account: SavedAccount = {
        name: 'Account 1',
        path: 0,
        nodeIP: null,
        address: address,
      };
      const openWalletInValid = this.errorOpenWallet == false;
      if (openWalletInValid) {
        this.authServ.addAccount(account);
        Swal.close(); // for closing sweetalert loader
        this.router.navigateByUrl('/dashboard');
      }
    }
    const openWalletInValid = this.errorOpenWallet == false;
    if (openWalletInValid) {
      this.authServ.savePassphraseSeed(passphrase, key);
      this.authServ.saveMasterSeed(masterSeed, key);
      Swal.close(); // for closing sweetalert loader
      this.router.navigateByUrl('/dashboard');
    }
  }
}
