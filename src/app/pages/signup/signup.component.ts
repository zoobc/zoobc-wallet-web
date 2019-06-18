import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import * as sha512 from "js-sha512";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AccountService } from "../../services/account.service";
import { AppService } from "../../app.service";



@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  isPinNeeded = localStorage.getItem("pin") ? false : true;

  modalRef: NgbModalRef;

  phraseWords: string[];
  keyPair: any;
  publicKey: any;
  address: string;

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
    private accountService: AccountService,
    private appServ: AppService
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
    this.phraseWords = this.generateNewPassphrase();
  }

  regenerateNewPassphrase(){
    this.phraseWords = this.generateNewPassphrase();
  }

  generateNewPassphrase() {
    const phraseWords : string[] = this.accountService.generatePhraseWords();
    const phrase = phraseWords.join(' ');

    const seed = this.accountService.GetSeedFromPhrase(phrase);
    let publicKey = this.accountService.GetPublicKeyFromSeed(seed);
    this.address = this.accountService.GetAddressFromPublicKey(publicKey);

    return phraseWords;
  }

  copyPassphrase() {
    const passphrase = this.phraseWords.join(" ");
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
      this.saveNewAccount();
      localStorage.setItem("pin", sha512.sha512(this.pinForm.value));

      this.modalRef.close();
    }
  }

  saveNewAccount() {
    // const strPubKey = this.toHexString(this.publicKey);
    // this.appServ.updateAllAccount(strPubKey, this.address);
    // this.appServ.changeCurrentAccount(strPubKey, this.address);
    const phrase = this.phraseWords.join(' ')
    const seed = this.accountService.GetSeedFromPhrase(phrase)
    let publicKey = this.accountService.GetPublicKeyFromSeed(seed)
    let address = this.accountService.GetAddressFromPublicKey(publicKey)
    console.log(phrase, address)
    
    this.appServ.updateAllAccount(publicKey.toString(), address);
    this.appServ.changeCurrentAccount(publicKey.toString(), address);
  }

  toHexString(byteArray) {
    return Array.from(byteArray, (byte: any) => {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
  }
}
