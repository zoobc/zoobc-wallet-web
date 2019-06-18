import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import * as sha512 from "js-sha512";
import objectHash from "object-hash";

import { AppService } from "../../app.service";
import { AccountService } from "../../services/account.service"

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
    private accountServ: AccountService
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

    this.accounts = appServ.getAllAccount();
  }

  ngOnInit() {}

  onLoginPin() {
    if (this.formLoginPin.valid) {
      if (this.pin == sha512.sha512(this.pinForm.value))
        this.isPinNeeded = false;
    }
  }

  onLoginAccount(val) {
    let account = this.accounts.find(acc => acc.address == val)
    this.appServ.changeCurrentAccount(account.publicKey, account.address);
    this.router.navigateByUrl("/dashboard");
  }

  onLoginMnemonic(content) {
    if (this.formLoginMnemonic.valid) {
      if (!this.isNeedNewPin) {
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
  }

  onSetPin() {
    if (this.formSetPin.valid) {
      this.saveNewAccount();
      localStorage.setItem("pin", sha512.sha512(this.setPinForm.value));
      this.modalRef.close();
    }
  }

  saveNewAccount() {
    const seed = this.accountServ.GetSeedFromPhrase(this.passPhraseForm.value)
    let publicKey = this.accountServ.GetPublicKeyFromSeed(seed)
    let address = this.accountServ.GetAddressFromPublicKey(publicKey)
    console.log(this.passPhraseForm.value, address)
    
    this.appServ.updateAllAccount(publicKey.toString(), address);
    this.appServ.changeCurrentAccount(publicKey.toString(), address);
  }
}
