import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';

import { AppService } from '../../app.service';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  pin = localStorage.getItem('pin');
  isLoggedIn: boolean;
  hasAccount = this.pin ? true : false;

  formSetPin: FormGroup;
  setPinForm = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern('^[0-9]*$'),
  ]);

  formLoginPin: FormGroup;
  pinForm = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern('^[0-9]*$'),
  ]);

  formLoginMnemonic: FormGroup;
  passPhraseForm = new FormControl('', Validators.required);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appServ: AppService,
    private accServ: AccountService
  ) {
    this.formLoginPin = new FormGroup({
      pin: this.pinForm,
    });

    this.formLoginMnemonic = new FormGroup({
      passPhrase: this.passPhraseForm,
    });

    this.formSetPin = new FormGroup({
      pin: this.setPinForm,
    });
  }

  ngOnInit() {
    let isLoggedIn: boolean = this.appServ.isLoggedIn();
    if (isLoggedIn) this.router.navigateByUrl('/dashboard');
  }

  onChangePin() {
    if (this.pinForm.value.length == 6) this.onLoginPin();
  }

  onLoginPin() {
    if (this.formLoginPin.valid) {
      if (this.pin == CryptoJS.SHA256(this.pinForm.value)) {
        let account = this.accServ.getCurrAccount();
        this.accServ.changeCurrentAccount(account);

        this.route.queryParams.subscribe(params => {
          const redirect = params.redirect || '/dashboard';
          this.router.navigateByUrl(redirect);
        });
      } else {
        this.pinForm.setErrors({ invalid: true });
      }
    }
  }
}
