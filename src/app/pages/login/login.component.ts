import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

import { AppService, LANGUAGES } from '../../app.service';
import { LanguageService } from 'src/app/services/language.service';
import { KeyringService } from '../../services/keyring.service';
import { GetAddressFromPublicKey } from '../../../helpers/utils';
import { AccountService, SavedAccount } from 'src/app/services/account.service';

const coin = 'ZBC';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private activeLanguage = 'en';
  pin = localStorage.getItem('pin');
  accounts: any = [];
  private languages = [];

  passphrase: string[];
  masterSeed: string;
  address: string;
  path: string;

  isLoggedIn: boolean;
  isNeedNewPin = this.pin ? false : true;

  modalRef: NgbModalRef;

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
    private appServ: AppService,
    private modalService: NgbModal,
    private langServ: LanguageService,
    private accServ: AccountService,
    private keyringServ: KeyringService
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

    this.accounts = accServ.getAllAccount();
  }

  ngOnInit() {
    this.languages = LANGUAGES;
    this.activeLanguage = localStorage.getItem('SELECTED_LANGUAGE') || 'en';

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
        this.router.navigateByUrl('/dashboard');
      } else {
        this.pinForm.setErrors({ invalid: true });
      }
    }
  }

  onLoginAccount(name: string) {
    let account = this.accounts.find(acc => acc.name == name);

    // this.appServ.changeCurrentAccount(account.path);
    this.router.navigateByUrl('/dashboard');
  }

  onLoginMnemonic(content) {
    if (this.formLoginMnemonic.valid) {
      if (!this.isNeedNewPin) {
        this.saveNewAccount();
        this.router.navigateByUrl('/dashboard');
        return false;
      }

      this.modalRef = this.modalService.open(content, {
        ariaLabelledBy: 'modal-basic-title',
        beforeDismiss: () => false,
      });
      this.modalRef.result.then(() => {
        this.router.navigateByUrl('/dashboard');
      });
    }
  }

  onSetPin() {
    if (this.formSetPin.valid) {
      localStorage.setItem('pin', CryptoJS.SHA256(this.setPinForm.value));
      this.saveNewAccount();
      this.modalRef.close();
    }
  }

  saveNewAccount() {
    const passphrase = this.passPhraseForm.value;

    const { seed } = this.keyringServ.calcBip32RootKeyFromMnemonic(
      coin,
      passphrase,
      'p4ssphr4se'
    );

    const childSeed = this.keyringServ.calcForDerivationPathForCoin(coin, 0);

    this.address = GetAddressFromPublicKey(childSeed.publicKey);
    this.masterSeed = seed;

    const account: SavedAccount = {
      name: 'Account 1',
      path: 0,
      imported: false,
    };

    this.accServ.saveMasterSeed(this.masterSeed);
    this.accServ.addAccount(account);
    this.router.navigateByUrl('/dashboard');
  }

  selectActiveLanguage() {
    this.langServ.setLanguage(this.activeLanguage);
  }
}
