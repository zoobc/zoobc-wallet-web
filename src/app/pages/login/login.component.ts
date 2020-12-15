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
      this.isLoading = true;
      if (this.authServ.loginPass(address, path)) {
        this.router.navigateByUrl('/dashboard');
      }
      this.isLoading = false;
    });
  }

  importAccount() {
    try {
      this.isLoadingImport = true;
      this.port = chrome.runtime.connect(this.extensionId);
      this.port.postMessage({ action: 'import-account' });
      this.port.onMessage.addListener(msg => {
        if (msg.message == 'failed') {
          let message = getTranslation('extension closed', this.translate);
          this.isLoadingImport = false;
          return Swal.fire('Opps...', message, 'error');
        } else {
          this.isLoadingImport = false;
          this.byPassLogin(msg.account.address, msg.account.path);
        }
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
}
