import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MultisigInfoComponent } from './multisig-info/multisig-info.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import Swal from 'sweetalert2';
import { AccountDatasetComponent } from '../account-dataset/account-dataset.component';

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
    private translate: TranslateService
  ) {
    this.currAcc = this.authServ.getCurrAccount();
    this.accounts = this.authServ.getAllAccount();
  }

  ngOnInit() {}

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

    let message = await getTranslation(`${this.currAcc.name} selected`, this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
  }

  onOpenMultisigInfoDialog(account: SavedAccount) {
    this.dialog.open(MultisigInfoComponent, {
      width: '300px',
      maxHeight: '90vh',
      data: account,
    });
  }

  onImportAccount() {
    this.myInputVariable.nativeElement.click();
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    if (file == undefined) return null;
    fileReader.readAsText(file, 'JSON');
    fileReader.onload = async () => {
      let fileResult = JSON.parse(fileReader.result.toString());
      if (!this.isSavedAccount(fileResult)) {
        let message = await getTranslation('You imported the wrong file', this.translate);
        return Swal.fire('Opps...', message, 'error');
      }
      setTimeout(() => {
        this.onOpenAddAccount(fileResult);
      }, 50);
    };
  }

  isSavedAccount(obj: any): obj is SavedAccount {
    if ((obj as SavedAccount).type) return true;
    return false;
  }

  async onDelete(index: number) {
    const message = await getTranslation('Are you sure want to delete this account?', this.translate);
    Swal.fire({
      title: message,
      showCancelButton: true,
      preConfirm: () => {
        const currAccount = this.authServ.getCurrAccount();
        if (this.accounts[index].address == currAccount.address) this.onSwitchAccount(this.accounts[0]);
        this.accounts.splice(index, 1);
        localStorage.setItem('ACCOUNT', JSON.stringify(this.accounts));
        return true;
      },
    });
  }

  onOpenAccDataSet(account: SavedAccount) {
    this.dialog.open(AccountDatasetComponent, {
      width: '400px',
      maxHeight: '99vh',
      data: account,
    });
  }
}
