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

  constructor(
    private authServ: AuthService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private activeRoute: ActivatedRoute
  ) {
    this.currAcc = this.authServ.getCurrAccount();
    this.accounts = this.authServ.getAllAccount();
    console.log(this.accounts);
  }

  ngOnInit() {
    if (this.activeRoute.snapshot.params['accountBase64']) {
      const accountBase64: string = this.activeRoute.snapshot.params['accountBase64'];
      const accountStr = atob(accountBase64);
      const account: SavedAccount = JSON.parse(accountStr);
      setTimeout(() => {
        this.onOpenAddAccount(account);
      }, 50);
    }
  }

  onOpenAddAccount(account: SavedAccount = null) {
    const dialog = this.dialog.open(AddAccountComponent, {
      width: '360px',
      maxHeight: '99vh',
      data: account,
    });

    dialog.afterClosed().subscribe((added: boolean) => {
      if (added) {
        this.accounts = this.authServ.getAllAccount();
        this.currAcc = this.authServ.getCurrAccount();
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
        this.accounts = this.authServ.getAllAccount();
        this.currAcc = this.authServ.getCurrAccount();
      }
    });
  }

  async onSwitchAccount(account: SavedAccount) {
    this.authServ.switchAccount(account);
    this.currAcc = account;

    let message: string = `${this.currAcc.name} selected`;
    this.snackbar.open(message, null, { duration: 3000 });
  }

  onOpenMultisigInfoDialog(account: SavedAccount) {
    this.dialog.open(MultisigInfoComponent, {
      width: '300px',
      data: account,
    });
  }

  async onDelete(index: number) {
    Swal.fire({
      title: 'Are you sure want to delete this account?',
      showCancelButton: true,
      preConfirm: () => {
        const currAccount = this.authServ.getCurrAccount();
        if (this.accounts[index].address == currAccount.address) this.onSwitchAccount(this.accounts[0]);
        this.accounts.splice(index, 1);
        if (environment.production) {
          localStorage.setItem('ACCOUNT_MAIN', JSON.stringify(this.accounts));
        } else {
          localStorage.setItem('ACCOUNT_TEST', JSON.stringify(this.accounts));
        }
        return true;
      },
    });
  }

  onImportAccount() {
    this.myInputVariable.nativeElement.click();
  }

  refreshAccounts() {
    this.accounts = this.authServ.getAllAccount();
    this.currAcc = this.authServ.getCurrAccount();
  }

  isSavedAccount(obj: any): obj is SavedAccount {
    if ((obj as SavedAccount).type) return true;
    return false;
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    if (file == undefined) return null;
    fileReader.readAsText(file, 'JSON');
    fileReader.onload = async () => {
      let fileResult = JSON.parse(fileReader.result.toString());
      if (!this.isSavedAccount(fileResult)) {
        return Swal.fire('Opps...', 'You mported the wrong file', 'error');
      }
      const accountSave: SavedAccount = fileResult;
      const idx = this.authServ.getAllAccount().findIndex(acc => acc.address == accountSave.address);
      if (idx >= 0) {
        return Swal.fire('Opps...', 'Account with that address is already exist', 'error');
      }
      this.authServ.addAccount(accountSave);
      Swal.fire({
        type: 'success',
        title: 'Account has been successfully imported',
        showConfirmButton: false,
        timer: 1000,
      });
      this.refreshAccounts();
    };
    this.myInputVariable.nativeElement.value = '';
  }
}
