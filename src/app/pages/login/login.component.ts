import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import * as sha512 from "js-sha512";
import * as CryptoJS from "crypto-js";

import { AppService } from "../../app.service";
import {
  GetPublicKeyFromSeed,
  GetAddressFromPublicKey,
  GetSeedFromPhrase
} from "../../../helpers/utils";
import { base64ToByteArray, fromBase64Url } from "../../../helpers/converters";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  pin = localStorage.getItem("pin");
  accounts: any = [];
  isPinNeeded = this.pin ? true : false;
  isNeedNewPin = this.pin ? false : true;

  modalRef: NgbModalRef;

  formSetPin: FormGroup;
  setPinForm = new FormControl("", [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern("^[0-9]*$")
  ]);

  formLoginPin: FormGroup;
  pinForm = new FormControl("", [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern("^[0-9]*$")
  ]);

  formLoginMnemonic: FormGroup;
  passPhraseForm = new FormControl("", Validators.required);

  constructor(
    private router: Router,
    private appServ: AppService,
    private modalService: NgbModal,
  ) {
    this.formLoginPin = new FormGroup({
      pin: this.pinForm
    });

    this.formLoginMnemonic = new FormGroup({
      passPhrase: this.passPhraseForm
    });

    this.formSetPin = new FormGroup({
      pin: this.setPinForm
    });

    let pin = localStorage.getItem("pin");
    let PKList: [] = appServ.getAllAccount();
    if (PKList.length > 0) {
      this.accounts = PKList.map(pk => {
        let seed = CryptoJS.AES.decrypt(pk, pin).toString(CryptoJS.enc.Utf8);
        let seedByte = base64ToByteArray(fromBase64Url(seed));

        let publicKey = GetPublicKeyFromSeed(seedByte);
        let address = GetAddressFromPublicKey(publicKey);

        return { seed: seedByte, address };
      });
    }
  }

  ngOnInit() {}

  onLoginPin() {
    if (this.formLoginPin.valid) {
      if (this.pin == sha512.sha512(this.pinForm.value))
        this.isPinNeeded = false;
    }
  }

  onLoginAccount(val) {
    let account = this.accounts.find(acc => acc.address == val);
    this.appServ.changeCurrentAccount(account.seed);
    this.router.navigateByUrl("/dashboard");
  }

  onLoginMnemonic(content) {
    if (this.formLoginMnemonic.valid) {
      if (!this.isNeedNewPin) {
        this.saveNewAccount();
        this.router.navigateByUrl("/dashboard");
        return false;
      }

      this.modalRef = this.modalService.open(content, {
        ariaLabelledBy: "modal-basic-title",
        beforeDismiss: () => false
      });
      this.modalRef.result.then(() => {
        this.router.navigateByUrl("/dashboard");
      });
    }
  }

  onSetPin() {
    if (this.formSetPin.valid) {
      localStorage.setItem("pin", sha512.sha512(this.setPinForm.value));
      this.saveNewAccount();
      this.modalRef.close();
    }
  }

  saveNewAccount() {
    const seed = GetSeedFromPhrase(this.passPhraseForm.value);

    this.appServ.updateAllAccount(seed);
    this.appServ.changeCurrentAccount(seed);
  }
}
