import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

import { KeyringService } from '../../services/keyring.service';
import { GetAddressFromPublicKey } from '../../../helpers/utils';
import { AccountService, SavedAccount } from 'src/app/services/account.service';

const coin = 'ZBC';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  isPinNeeded = localStorage.getItem('pin') ? false : true;

  modalRef: NgbModalRef;

  passphrase: string[];
  masterSeed: string;
  address: string;
  path: string;

  formTerms: FormGroup;
  isWrittenDown = new FormControl(false, Validators.required);
  isAgree = new FormControl(false, Validators.required);

  formSetPin: FormGroup;
  pinForm = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern('^[0-9]*$'),
  ]);

  submitted = false;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private accServ: AccountService,
    private keyringServ: KeyringService
  ) {
    this.formSetPin = new FormGroup({
      pin: this.pinForm,
    });

    this.formTerms = new FormGroup({
      isWrittenDown: this.isWrittenDown,
      isAgree: this.isAgree,
    });
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.generateNewWallet();
  }

  generateNewWallet() {
    let { phrase: passphrase } = this.keyringServ.generateRandomPhrase();
    // let passphrase =
    //   'cause bicycle craft spike mention matter ensure fancy crisp climb lamp easily dish wedding tomorrow wing ancient flight man host river record joke cannon';
    const pass = 'p4ssphr4se';

    const { seed } = this.keyringServ.calcBip32RootKeyFromMnemonic(
      coin,
      passphrase,
      pass
    );

    const childSeed = this.keyringServ.calcForDerivationPathForCoin(coin, 0);
    this.address = GetAddressFromPublicKey(childSeed.publicKey);
    this.masterSeed = seed;
    this.passphrase = passphrase.split(' ');
  }

  copyPassphrase() {
    const passphrase = this.passphrase.join(' ');
    this.copyText(passphrase);
  }

  copyText(text) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  openCreatePin(content) {
    if (!this.isPinNeeded) {
      this.saveNewAccount();
      this.router.navigateByUrl('/dashboard');
      return true;
    }

    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      beforeDismiss: () => false,
    });
    this.modalRef.result.then(() => {
      this.router.navigateByUrl('/dashboard');
    });
  }

  onSetPin(event) {
    event.preventDefault();
    this.submitted = true;

    if (this.formSetPin.valid) {
      localStorage.setItem('pin', CryptoJS.SHA256(this.pinForm.value));
      this.saveNewAccount();

      this.modalRef.close();
    }
  }

  saveNewAccount() {
    this.accServ.saveMasterSeed(this.masterSeed);
    const account: SavedAccount = {
      path: 0,
      name: 'Account 1',
      imported: false,
    };
    this.accServ.addAccount(account);
  }
}
