import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as CryptoJS from "crypto-js";
import * as bip39 from "bip39";
import * as bip32 from "bip32";
import { BIP32Interface } from "bip32";

import { AppService } from "../../app.service";
import { GetAddressFromPublicKey } from "../../../helpers/utils";
import { AccountService } from "src/app/services/account.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  isPinNeeded = localStorage.getItem("pin") ? false : true;

  modalRef: NgbModalRef;

  passphrase: string[];
  masterSeed: string;
  address: string;
  path: string;

  formTerms: FormGroup;
  isWrittenDown = new FormControl(false, Validators.required);
  isAgree = new FormControl(false, Validators.required);

  formSetPin: FormGroup;
  pinForm = new FormControl("", [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern("^[0-9]*$")
  ]);

  submitted = false;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private appServ: AppService,
    private accServ: AccountService
  ) {
    this.formSetPin = new FormGroup({
      pin: this.pinForm
    });

    this.formTerms = new FormGroup({
      isWrittenDown: this.isWrittenDown,
      isAgree: this.isAgree
    });
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.generateNewWallet();
  }

  generateNewWallet() {
    let passphrase = bip39.generateMnemonic();
    bip39.mnemonicToSeed(passphrase).then(seed => {
      this.path = this.accServ.generateDerivationPath();

      const masterSeed = bip32.fromSeed(seed);
      const childSeed: BIP32Interface = masterSeed.derivePath(this.path);
      const publicKey: Uint8Array = childSeed.publicKey.slice(1, 33);

      this.address = GetAddressFromPublicKey(publicKey);
      this.masterSeed = masterSeed.toBase58();
      this.passphrase = passphrase.split(" ");
    });
  }

  copyPassphrase() {
    const passphrase = this.passphrase.join(" ");
    this.copyText(passphrase);
  }

  copyText(text) {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.opacity = "0";
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }

  openCreatePin(content) {
    if (!this.isPinNeeded) {
      this.saveNewAccount();
      this.router.navigateByUrl("/dashboard");
      return true;
    }

    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      beforeDismiss: () => false
    });
    this.modalRef.result.then(() => {
      this.router.navigateByUrl("/dashboard");
    });
  }

  onSetPin() {
    this.submitted = true;

    if (this.formSetPin.valid) {
      localStorage.setItem("pin", CryptoJS.SHA256(this.pinForm.value));
      this.saveNewAccount();

      this.modalRef.close();
    }
  }

  saveNewAccount() {
    this.appServ.saveMasterWallet(this.masterSeed);
    this.appServ.updateAllAccount(this.path, "Account 1");
    this.appServ.changeCurrentAccount(this.path);
  }
}
