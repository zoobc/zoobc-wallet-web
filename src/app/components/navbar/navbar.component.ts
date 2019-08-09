import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageService } from 'src/app/services/language.service';
import { LANGUAGES } from 'src/app/app.service';
import { MatDialog } from '@angular/material';
import { AddAccountComponent } from 'src/app/pages/add-account/add-account.component';
import { AddNodeAdminComponent } from 'src/app/pages/add-node-admin/add-node-admin.component';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

  languages = [];
  activeLanguage = 'en';

  accounts: [SavedAccount];
  currAcc: SavedAccount;

  isLoggedIn: boolean = false;

  constructor(
    private langServ: LanguageService,
    private authServ: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.isLoggedIn = this.authServ.currPublicKey ? true : false;
  }

  ngOnInit() {
    this.languages = LANGUAGES;
    this.activeLanguage = localStorage.getItem('SELECTED_LANGUAGE') || 'en';
    this.accounts = this.authServ.getAllAccount();
    this.currAcc = this.authServ.getCurrAccount();
  }

  onSwitchAccount(account: SavedAccount) {
    this.authServ.switchAccount(account);
    this.currAcc = this.authServ.getCurrAccount();
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

  onOpenAddNodeAdmin() {
    this.dialog.open(AddNodeAdminComponent, {
      width: '360px',
    });
  }

  onLogout() {
    Swal.fire({
      title: 'Are you sure want to logout?',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.authServ.currSeed = null;
        this.authServ.currPublicKey = null;
        this.authServ.currAddress = null;

        this.router.navigateByUrl('/');
        return true;
      },
    });
  }
}
