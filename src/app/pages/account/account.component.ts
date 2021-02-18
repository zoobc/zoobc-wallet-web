import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MultisigInfoComponent } from './multisig-info/multisig-info.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  currAcc: SavedAccount;
  accounts: SavedAccount[];
  @ViewChild('fileInput') myInputVariable: ElementRef;

  constructor(private authServ: AuthService, public dialog: MatDialog, private snackbar: MatSnackBar) {
    this.refreshAccounts();
  }

  ngOnInit() {}

  onOpenAddAccount() {
    const dialog = this.dialog.open(AddAccountComponent, {
      width: '360px',
      maxHeight: '99vh',
    });

    dialog.afterClosed().subscribe((added: boolean) => {
      if (added) {
        this.refreshAccounts();
      }
    });
  }

  onOpenEditAccount(account: SavedAccount) {
    const dialog = this.dialog.open(EditAccountComponent, {
      width: '360px',
      maxHeight: '99vh',
      data: account,
    });
    dialog.afterClosed().subscribe((edited: boolean) => {
      if (edited) {
        this.refreshAccounts();
      }
    });
  }

  async onSwitchAccount(account: SavedAccount) {
    this.authServ.switchAccount(account);
    this.currAcc = account;

    let message = 'Account selected';
    this.snackbar.open(message, null, { duration: 3000 });
  }

  onOpenMultisigInfoDialog(account: SavedAccount) {
    this.dialog.open(MultisigInfoComponent, {
      width: '360px',
      maxHeight: '90vh',
      data: account,
    });
  }

  onImportAccount() {
    this.myInputVariable.nativeElement.click();
  }

  refreshAccounts() {
    this.accounts = this.authServ.getAllAccount();
    this.currAcc = this.authServ.getCurrAccount();
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    if (file == undefined) return null;
    fileReader.readAsText(file, 'JSON');
    fileReader.onload = async () => {
      let fileResult = JSON.parse(fileReader.result.toString());
      if (!this.isSavedAccount(fileResult)) {
        let message = 'You imported the wrong file';
        return Swal.fire('Opps...', message, 'error');
      }
      const accountSave: SavedAccount = fileResult;
      const idx = this.authServ.getAllAccount().findIndex(acc => acc.address == accountSave.address);
      if (idx >= 0) {
        let message = 'account with that address is already exist';
        return Swal.fire('Opps...', message, 'error');
      }
      this.authServ.addAccount(accountSave);
      let message = 'account has been successfully imported';
      Swal.fire({
        type: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1000,
      });
      this.refreshAccounts();
    };
    this.myInputVariable.nativeElement.value = '';
  }

  isSavedAccount(obj: any): obj is SavedAccount {
    if ((obj as SavedAccount).type) return true;
    return false;
  }

  async onDelete(index: number) {
    const message = 'are you sure want to delete this account?';
    Swal.fire({
      title: message,
      showCancelButton: true,
      preConfirm: () => {
        const currAccount = this.authServ.getCurrAccount();
        if (this.accounts[index].address == currAccount.address) this.onSwitchAccount(this.accounts[0]);
        this.accounts.splice(index, 1);
        const net = environment.production ? 'MAIN' : 'TEST';
        localStorage.setItem(`ACCOUNT_${net}`, JSON.stringify(this.accounts));
        return true;
      },
    });
  }
}
