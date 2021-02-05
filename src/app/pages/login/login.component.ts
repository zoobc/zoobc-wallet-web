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

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { AfterViewInit, Component, Inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { getTranslation } from 'src/helpers/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { PinsComponent } from 'src/app/components/pins/pins.component';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Address } from 'zbc-sdk';
import { DOCUMENT } from '@angular/platform-browser';
import { PrivateKeyComponent } from './private-key/private-key.component';
import { MatDialog } from '@angular/material';
import { AddressComponent } from './address/address.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('pin') pin: PinsComponent;

  encPassphrase = localStorage.getItem('ENC_PASSPHRASE_SEED');
  isLoggedIn: boolean;
  isLoading: boolean = false;
  isLoadingImport: boolean = false;
  hasAccount = this.encPassphrase ? true : false;
  extensionId = environment.extId;
  port;

  formLoginPin: FormGroup;
  pinForm = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern('^[0-9]*$'),
  ]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appServ: AppService,
    private authServ: AuthService,
    private zone: NgZone,
    private translate: TranslateService,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document
  ) {
    this.formLoginPin = new FormGroup({
      pin: this.pinForm,
    });
  }

  ngOnInit() {
    let isLoggedIn: boolean = this.appServ.isLoggedIn();
    if (isLoggedIn) this.router.navigateByUrl('/dashboard');
  }

  ngAfterViewInit() {
    this.toogleBackground();
  }

  ngOnDestroy() {
    this.toogleBackground(false);
  }

  onChangePin() {
    if (this.pinForm.value.length == 6) this.onLogin();
  }

  onLogin() {
    if (this.formLoginPin.valid) {
      this.isLoading = true;

      setTimeout(() => {
        if (this.authServ.login(this.pinForm.value)) {
          this.route.queryParams.subscribe(params => {
            const redirect = params.redirect || '/dashboard';
            this.router.navigateByUrl(redirect);
          });
        } else {
          this.pinForm.setErrors({ invalid: true });
          this.pin.onReset();
        }
        this.isLoading = false;
      }, 50);
    }
  }

  byPassLogin(address: Address, path: number) {
    this.zone.run(() => {
      const account: SavedAccount = {
        name: 'Ledger Account',
        address: address,
        path,
        type: 'one time login',
      };
      if (this.authServ.loginWithoutPin(account)) this.router.navigateByUrl('/dashboard');
    });
  }

  isInstalled(): Promise<boolean> {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(this.extensionId, 'installed', installed => resolve(installed));
    });
  }

  async importAccount() {
    const installed = await this.isInstalled();
    if (installed == undefined) {
      const message = getTranslation('please install zoobc connect', this.translate);
      Swal.fire('Opps...', message, 'error');
      return false;
    }

    try {
      this.isLoadingImport = true;
      this.port = chrome.runtime.connect(this.extensionId);
      this.port.postMessage({ action: 'import-account' });
      this.port.onMessage.addListener(msg => {
        if (msg.message == 'success') {
          this.byPassLogin(msg.account.address, msg.account.path);
        }
        this.zone.run(() => {
          this.isLoadingImport = false;
        });
      });
    } catch (error) {
      let message = getTranslation('extension not found', this.translate);
      return Swal.fire('Opps...', message, 'error');
    }
  }

  toogleBackground(show: boolean = true) {
    if (show) this.document.getElementById('navbar-head').classList.add('no-color');
    else this.document.getElementById('navbar-head').classList.remove('no-color');
    let boxImage = this.document.getElementsByClassName('background-box');
    for (let i = 0; i < boxImage.length; i++) {
      if (show) boxImage[i].classList.remove('hide');
      else boxImage[i].classList.add('hide');
    }
  }

  loginWithPrivKey() {
    this.dialog.open(PrivateKeyComponent, {
      width: '400px',
      maxHeight: '99vh',
    });
  }

  loginWithAddress() {
    this.dialog.open(AddressComponent, {
      width: '400px',
      maxHeight: '99vh',
    });
  }
}
