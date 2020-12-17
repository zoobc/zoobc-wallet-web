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
      chrome.runtime.sendMessage(this.extensionId, 'installed?', installed => resolve(installed));
    });
  }

  async importAccount() {
    let installed = await this.isInstalled();

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
}
