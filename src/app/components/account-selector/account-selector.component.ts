import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import {
  CurrencyRateService,
  Currency,
} from 'src/app/services/currency-rate.service';

@Component({
  selector: 'account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.scss'],
})
export class AccountSelectorComponent implements OnInit {
  @ViewChild('accountDialog') accountDialog: TemplateRef<any>;
  @Output() select: EventEmitter<SavedAccount> = new EventEmitter();

  accountRefDialog: MatDialogRef<any>;

  isLoading = false;
  isError = false;

  account: SavedAccount;
  accounts: SavedAccount[];

  currencyRate: Currency = {
    name: '',
    value: 0,
  };

  constructor(
    private authServ: AuthService,
    private dialog: MatDialog,
    private currencyServ: CurrencyRateService
  ) {}

  ngOnInit() {
    this.currencyServ.currencyRate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });

    this.account = this.authServ.getCurrAccount();
    this.getAccounts();
  }

  getAccounts() {
    this.isLoading = true;
    this.isError = false;
    this.authServ
      .getAccountsWithBalance()
      .then((res: SavedAccount[]) => {
        this.accounts = res;
        this.account = this.accounts.find(acc => this.account.path == acc.path);
      })
      .catch(() => (this.isError = true))
      .finally(() => (this.isLoading = false));
  }

  openAccountList() {
    this.accountRefDialog = this.dialog.open(this.accountDialog, {
      width: '360px',
    });
  }

  onSwitchAccount(account: SavedAccount) {
    this.authServ.switchAccount(account);
    this.account = account;
    this.accountRefDialog.close();
    this.select.emit(account);
  }
}
