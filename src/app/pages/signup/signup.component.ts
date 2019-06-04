import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { wordlist } from "../../../assets/js/wordlist";
import objectHash from "object-hash";
import * as sha512 from "js-sha512";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { formArrayNameProvider } from "@angular/forms/src/directives/reactive_directives/form_group_name";

import { AppService } from "../../app.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  isPinNeeded = localStorage.getItem("pin") ? false : true;

  modalRef: NgbModalRef;

  phaseprase: any;
  publicKey: string;

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

  constructor(
    private modalService: NgbModal,
    private router: Router,
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
    this.generateNewPassphrase();
  }

  generateNewPassphrase() {
    const crypto = window.crypto;
    let pass: any;
    const phraseWords = [];

    if (crypto) {
      const bits = 128;
      const random = new Uint32Array(bits / 32);
      crypto.getRandomValues(random);
      const n = wordlist.length;
      let x: any;
      let w1: any;
      let w2: any;
      let w3: any;

      for (let i = 0; i < random.length; i++) {
        x = random[i];
        w1 = x % n;
        w2 = (((x / n) >> 0) + w1) % n;
        w3 = (((((x / n) >> 0) / n) >> 0) + w2) % n;
        phraseWords.push(wordlist[w1]);
        phraseWords.push(wordlist[w2]);
        phraseWords.push(wordlist[w3]);
      }
    }
    this.phaseprase = phraseWords;
    this.convertHash();
    return this.phaseprase.sort(() => Math.random() - 0.5);
  }

  copyPassphrase() {
    const phaseprase = this.phaseprase.join(" ");
    this.copyText(phaseprase);
  }

  convertHash() {
    const phaseprases = this.phaseprase;
    this.publicKey = objectHash(phaseprases);
    localStorage.setItem("publicKey", JSON.stringify(this.publicKey));
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
    if (this.formSetPin.valid) {
      this.saveNewAccount()
      localStorage.setItem("pin", sha512.sha512(this.pinForm.value));

      this.modalRef.close();
    }
  }

  saveNewAccount() {
    this.appServ.updateAllAccount(this.publicKey);
    this.appServ.changeCurrentAccount(this.publicKey);
  }
}
