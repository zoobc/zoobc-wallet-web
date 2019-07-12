import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageService } from 'src/app/services/language.service';
import { LANGUAGES } from 'src/app/app.service';
import { AccountService, SavedAccount } from 'src/app/services/account.service';
import { MatDialog } from '@angular/material';
import { AddAccountComponent } from 'src/app/pages/add-account/add-account.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();
  @Input() isActive: string;

  private languages = [];
  private activeLanguage = 'en';

  accounts: [SavedAccount];
  currAcc: SavedAccount;

  constructor(
    private langServ: LanguageService,
    private accServ: AccountService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.languages = LANGUAGES;
    this.activeLanguage = localStorage.getItem('SELECTED_LANGUAGE') || 'en';
    this.accounts = this.accServ.getAllAccount();
    this.currAcc = this.accServ.getCurrAccount();
  }

  onSwitchAccount(account: SavedAccount) {
    this.accServ.changeCurrentAccount(account);
    this.currAcc = this.accServ.getCurrAccount();
    this.router.navigateByUrl('/');
  }

  selectActiveLanguage(lang) {
    this.langServ.setLanguage(lang);
    this.activeLanguage = lang;
  }

  onOpenAddAccount() {
    this.dialog.open(AddAccountComponent, {
      width: '360px',
    });
  }
}
