import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AppService } from '../../app.service';
import { AuthService } from 'src/app/services/auth.service';

import * as CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
const GibberishAES = require('../../../helpers/gibberish-aes.js');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  encPassphrase = localStorage.getItem('ENC_PASSPHRASE_SEED');
  isLoggedIn: boolean;
  isLoading: boolean = false;
  hasAccount = this.encPassphrase ? true : false;

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
    private authServ: AuthService
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

    const key = 'abcdefgh12345678';
    const cert = {
      nodeKey: 'evolve list approve kangaroo fringe romance space kit idle shop major open',
      ownerAccount: 'ZBC_RERG3XD7_GAKOZZKY_VMZP2SQE_LBP45DC6_VDFGDTFK_3BZFBQGK_JMWELLO7',
    };
    const plaintText = JSON.stringify(cert);

    let enc: string = GibberishAES.enc(plaintText, key);
    enc = enc.replace(/(\r\n|\n|\r)/gm, '');
    console.log(enc);

    const data = {
      encrypted: enc,
    };
    // {"encrypted":"U2FsdGVkX18ycE8+0gEr3qXPSNJd42+AtviYCnDda5pAioKZRgweJqgqD1GC5+5W+iz9+72woESwI0EnChAl2Zd8h27EWkiu7+ocXIuFfXefsOgpX0KGyRuypVjtEjKNUP8pgKDCE0pT5/JXPRBVK3tJTENIIr97SxYGTmbLD4gQ8NsBMU+P769a/agBXtPj7kEzkuyp8SMxjNUQFVU3iHUG6o2KjBveDpA8zaBIh1I9YEVqifrnJWix91Tf80MjtyUq5qbdMmS+I/tRy/sBmg==","iv":"6ccc2efcaf5b05a01adf38c5dbf4d808"}

    const blob = new Blob([enc]);
    saveAs(blob, 'Certificate.zbc');
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
        } else this.pinForm.setErrors({ invalid: true });
        this.isLoading = false;
      }, 50);
    }
  }
}
