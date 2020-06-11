import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.scss'],
})
export class AccountSelectorComponent implements OnInit {
  @ViewChild('accountDialog') accountDialog: TemplateRef<any>;

  @Input() type: 'normal' | 'multisig' = null;
  @Input() switchAccount: boolean = true;
  @Input() selectedValue: string;
  @Output() select: EventEmitter<SavedAccount> = new EventEmitter();

  accountRefDialog: MatDialogRef<any>;

  isLoading = false;
  isError = false;

  account: SavedAccount;
  accounts: SavedAccount[];

  constructor(private authServ: AuthService, private dialog: MatDialog) {}

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    this.accounts = this.authServ.getAllAccount();
  }

  openAccountList() {
    this.accountRefDialog = this.dialog.open(this.accountDialog, {
      width: '380px',
      maxHeight: '90vh',
    });
  }

  onSwitchAccount(account: SavedAccount) {
    if (this.switchAccount) this.authServ.switchAccount(account);
    this.account = account;
    this.accountRefDialog.close();
    this.select.emit(account);
  }
}
