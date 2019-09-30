import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { KeyringService } from 'src/app/services/keyring.service';
import { PinSetupDialogComponent } from 'src/app/components/pin-setup-dialog/pin-setup-dialog.component';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { MnemonicsService } from 'src/app/services/mnemonics.service';

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

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private mnemonicServ: MnemonicsService
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
      this.saveNewAccount(key);
      this.router.navigateByUrl('/dashboard');
    });
  }

  saveNewAccount(key: string) {
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
      nodeIP: null,
    };

    this.authServ.saveMasterSeed(masterSeed, key);
    this.authServ.addAccount(account);
    this.router.navigateByUrl('/dashboard');
  }
}
