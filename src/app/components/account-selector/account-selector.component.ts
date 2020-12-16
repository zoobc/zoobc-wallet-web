import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { SavedAccount, AuthService, AccountType } from 'src/app/services/auth.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';

@Component({
  selector: 'account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.scss'],
})
export class AccountSelectorComponent implements OnInit {
  @ViewChild('accountDialog') accountDialog: TemplateRef<any>;

  @Input() type: AccountType = null;
  @Input() switchAccount: boolean = true;
  @Input() selectedValue: string;
  @Input() addresses?: string[];
  @Input() withBalance: boolean = true;
  @Output() select: EventEmitter<SavedAccount> = new EventEmitter();

  accountRefDialog: MatDialogRef<any>;

  isLoading = false;
  isError = false;

  account: SavedAccount;
  accounts: SavedAccount[];

  currencyRate: Currency;

  constructor(
    private authServ: AuthService,
    private dialog: MatDialog,
    private currencyServ: CurrencyRateService
  ) {}

  ngOnInit() {
    this.currencyServ.rate.subscribe(rate => (this.currencyRate = rate));
    this.account = this.authServ.getCurrAccount();
    this.getAccounts();
  }

  getAccounts() {
    this.isLoading = true;
    this.isError = false;
    this.authServ
      .getAccountsWithBalance(this.type)
      .then((res: SavedAccount[]) => {
        this.accounts = res;
        if (this.addresses) {
          this.accounts = this.accounts.filter(res => this.addresses.includes(res.address.value));
          this.account = this.accounts[0];
        } else if (this.selectedValue) {
          this.account = this.accounts.find(acc => acc.address.value == this.selectedValue);
        } else if (this.switchAccount) {
          this.account = this.accounts.find(acc => this.account.address.value == acc.address.value);
          if (!this.account) this.account = this.accounts[0];
        }

        this.select.emit(this.account);
      })
      .catch(() => (this.isError = true))
      .finally(() => (this.isLoading = false));
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
