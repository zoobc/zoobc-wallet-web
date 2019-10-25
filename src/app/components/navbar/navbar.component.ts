import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { LanguageService, LANGUAGES } from 'src/app/services/language.service';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material';
import { AddNodeAdminComponent } from 'src/app/pages/add-node-admin/add-node-admin.component';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs/internal/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { RevealPassphraseComponent } from '../reveal-passphrase/reveal-passphrase.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

  languages = [];
  activeLanguage = 'en';

  isLoggedIn: boolean = false;

  account: SavedAccount;
  node: string = '';

  routerEvent: Subscription;

  constructor(
    private langServ: LanguageService,
    private authServ: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private appServ: AppService,
    private translate: TranslateService
  ) {
    this.isLoggedIn = this.authServ.isLoggedIn() ? true : false;

    this.routerEvent = this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        this.account = authServ.getCurrAccount();
        this.node = this.account ? this.account.nodeIP : null;
      }
    });
  }

  ngOnInit() {
    this.languages = LANGUAGES;
    this.activeLanguage = localStorage.getItem('SELECTED_LANGUAGE') || 'en';
  }

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }

  onToggle() {
    this.appServ.toggle();
  }

  selectActiveLanguage(lang) {
    this.langServ.setLanguage(lang);
    this.activeLanguage = lang;
  }

  onOpenAddNodeAdmin() {
    this.dialog.open(AddNodeAdminComponent, {
      width: '360px',
    });
  }

  onOpenRevealPassphrase() {
    this.dialog.open(RevealPassphraseComponent, {
      width: '420px',
    });
  }

  async onLogout() {
    let message: string;
    await this.translate
      .get('Are you sure want to logout?')
      .toPromise()
      .then(res => (message = res));

    Swal.fire({
      title: message,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.authServ.logout();
        this.router.navigateByUrl('/');
        return true;
      },
    });
  }
}
