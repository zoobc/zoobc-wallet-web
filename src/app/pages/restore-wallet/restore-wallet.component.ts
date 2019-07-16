import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AccountService, SavedAccount } from 'src/app/services/account.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { PinSetupDialogComponent } from 'src/app/components/pin-setup-dialog/pin-setup-dialog.component';

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
    private accServ: AccountService,
    private keyringServ: KeyringService
  ) {
    this.restoreForm = new FormGroup({
      passphrase: this.passphraseField,
    });
  }

  ngOnInit() {}

  onRestore() {
    if (this.restoreForm.valid) {
      let pinDialog = this.dialog.open(PinSetupDialogComponent, {
        width: '400px',
        disableClose: true,
      });
      pinDialog.afterClosed().subscribe(() => {
        this.saveNewAccount();
        this.router.navigateByUrl('/dashboard');
      });
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
    };

    this.accServ.saveMasterSeed(masterSeed);
    this.accServ.addAccount(account);
    this.router.navigateByUrl('/dashboard');
  }
}
