// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

//     2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
// contact us at roberto.capodieci[at]blockchainzoo.com
// and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { LanguageService, LANGUAGES } from 'src/app/services/language.service';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material';
import { AddNodeAdminComponent } from 'src/app/pages/node-admin/add-node-admin/add-node-admin.component';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs/internal/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { RevealPassphraseComponent } from '../reveal-passphrase/reveal-passphrase.component';
import { getTranslation } from 'src/helpers/utils';

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
  networkSelected = "Main Net";

  constructor(
    private langServ: LanguageService,
    private authServ: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private appServ: AppService,
    private translate: TranslateService
  ) {
    this.routerEvent = this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        this.isLoggedIn = this.authServ.isLoggedIn() ? true : false;
        this.account = authServ.getCurrAccount();
        this.node = this.account ? this.account.nodeIP : null;
      }
    });

    // if network changed reload data
    this.appServ.netWorkEvent.subscribe(() => {
      this.loadNetwork();
    });

  }

  ngOnChanges() {
    console.log(' ngOnChanges: ngOnChanges');
  }
  ngAfterViewInit() {
    console.log(' navbar: loading');
  }

  loadNetwork() {
    const ndList = JSON.parse(localStorage.getItem('NODE_LIST'));
    if (ndList && ndList.length > 0) {
      const lst = ndList.filter((x: any) => x.selected == true);
      console.log('network selected: ', lst.length + ': ', lst);
      this.networkSelected = lst[0].label;
      console.log('network label: ', this.networkSelected);
    }
  }

  ngOnInit() {
    try {
      this.loadNetwork();
    } catch { }

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
      maxHeight: '90vh',
    });
  }

  onOpenRevealPassphrase() {
    this.dialog.open(RevealPassphraseComponent, {
      width: '420px',
      maxHeight: '90vh',
    });
  }

  onComingSoonPage() {
    const message = getTranslation('coming soon', this.translate);
    Swal.fire({
      type: 'info',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  onLogout() {
    const message = getTranslation('are you sure want to logout?', this.translate);
    const confirmButtonText = getTranslation('ok', this.translate);
    const cancelButtonText = getTranslation('cancel', this.translate);
    Swal.fire({
      title: message,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      preConfirm: () => {
        this.authServ.logout();
        this.router.navigateByUrl('/');
        return true;
      },
    });
  }
}
