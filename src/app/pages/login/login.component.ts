import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import * as CryptoJS from "crypto-js";
import { GetSeedFromPhrase } from "../../../helpers/utils";
import { AppService, LANGUAGES } from "../../app.service";
import { LanguageService } from "src/app/services/language.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  private activeLanguage = "en";
  pin = localStorage.getItem("pin");
  accounts: any = [];
  private languages = [];

  isLoggedIn: boolean;
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
    private langServ: LanguageService
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

  ngOnInit() {
    this.languages = LANGUAGES;
    this.activeLanguage = localStorage.getItem("SELECTED_LANGUAGE") || "en";

    let isLoggedIn: boolean = this.appServ.isLoggedIn();
    if (isLoggedIn) this.router.navigateByUrl("/dashboard");
  }

  onChangePin() {
    if (this.pinForm.value.length == 6) this.onLoginPin();
  }

  onLoginPin() {
    if (this.formLoginPin.valid) {
      if (this.pin == CryptoJS.SHA256(this.pinForm.value)) {
        let account = this.appServ.getCurrAccount();
        this.appServ.changeCurrentAccount(account.path);
        this.router.navigateByUrl("/dashboard");
      } else {
        this.pinForm.setErrors({ invalid: true });
      }
    }
  }

  onLoginAccount(name: string) {
    let account = this.accounts.find(acc => acc.name == name);
    console.log(account);

    this.appServ.changeCurrentAccount(account.path);
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
      localStorage.setItem("pin", CryptoJS.SHA256(this.setPinForm.value));
      this.saveNewAccount();
      this.modalRef.close();
    }
  }

  saveNewAccount() {
    const seed = GetSeedFromPhrase(this.passPhraseForm.value);

    // this.appServ.updateAllAccount(seed);
    // this.appServ.changeCurrentAccount(seed);
  }

  selectActiveLanguage() {
    console.log("this.activeLanguage", this.activeLanguage);
    this.langServ.setLanguage(this.activeLanguage);
  }
}
