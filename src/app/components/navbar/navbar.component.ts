import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { LanguageService } from 'src/app/services/language.service';
import { LANGUAGES, AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material';
import { AddNodeAdminComponent } from 'src/app/pages/add-node-admin/add-node-admin.component';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs/internal/Subscription';

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
    private appServ: AppService
  ) {
    this.isLoggedIn = this.authServ.currPublicKey ? true : false;

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
