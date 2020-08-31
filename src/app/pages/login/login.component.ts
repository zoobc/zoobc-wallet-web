import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AppService } from '../../app.service';
import { AuthService } from 'src/app/services/auth.service';
import { PinsComponent } from 'src/app/components/pins/pins.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('pin') pin: PinsComponent;

  encPassphrase: string;
  isLoggedIn: boolean;
  isLoading: boolean = false;
  hasAccount: boolean = false;

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
    private authServ: AuthService
  ) {
    this.formLoginPin = new FormGroup({
      pin: this.pinForm,
    });
    if (environment.production) {
      this.encPassphrase = localStorage.getItem('ENC_PASSPHRASE_SEED_MAIN');
    } else {
      this.encPassphrase = localStorage.getItem('ENC_PASSPHRASE_SEED_TEST');
    }
    this.hasAccount = this.encPassphrase ? true : false;
  }

  ngOnInit() {
    let isLoggedIn: boolean = this.appServ.isLoggedIn();
    if (isLoggedIn) this.router.navigateByUrl('/dashboard');
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
}
