import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { wordlist } from "../../../assets/js/wordlist";
import * as sha512 from "js-sha512";
import * as sha256 from "sha256";
import { eddsa as EdDSA } from "elliptic";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AppService } from "../../app.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  isPinNeeded = localStorage.getItem("pin") ? false : true;

  modalRef: NgbModalRef;

  passphrase: any;
  pairKey: any;
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
    this.passphrase = phraseWords;
    this.pairKey = this.getPairKey(phraseWords);
    return phraseWords;
  }

  copyPassphrase() {
    const passphrase = this.passphrase.join(" ");
    this.copyText(passphrase);
  }

  getPairKey(passphrase) {
    // convert passphrase string to bytes
    let seedBuffer = new TextEncoder().encode(passphrase);
    console.log(seedBuffer);

    // convert bytes to sha256
    let seedHash = sha256(seedBuffer);
    console.log(seedHash);

    // generate keypair from sha256
    let ec = new EdDSA("ed25519");
    let pairKey = ec.keyFromSecret(seedHash);
    console.log("pubkey", pairKey.getPublic());
    console.log("private key", pairKey.secret());
    console.log("ec all", pairKey);

    // get checksum from pubkey
    let checksum = this.getChecksumByte(pairKey.getPublic());
    // concat pubkey and checksum
    let addressByte = [...pairKey.getPublic(), checksum[0]];
    console.log("address", addressByte);

    // convert address byte to base64
    var binary = "";
    var bytes = new Uint8Array(addressByte);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let address = window.btoa(binary);
    this.address = address
    console.log("base64", address);

    // SEND MONEY OR MESSAGE
    // let message = "SpineChain is Best BlockChain";
    // let messageBuffer = new TextEncoder().encode(message);
    // console.log("messageBuffer", messageBuffer);

    // let signature = pairKey.sign(pairKey.getPublic());
    // console.log("hex pubkey", this.toHexString(pairKey.getPublic()));

    // console.log(pairKey.verify(messageBuffer, [...signature._Rencoded, 11]));

    return pairKey;
  }

  toHexString(byteArray) {
    return Array.from(byteArray, (byte: any) => {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
  }

  getChecksumByte(bytes) {
    var n = bytes.length;
    var a = 0;
    for (let i = 0; i < n; i++) a += bytes[i];
    let res = new Uint8Array([a]);

    return res;
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
      this.saveNewAccount();
      localStorage.setItem("pin", sha512.sha512(this.pinForm.value));

      this.modalRef.close();
    }
  }

  saveNewAccount() {
    this.appServ.updateAllAccount(this.pairKey.getPublic);
    this.appServ.changeCurrentAccount(this.pairKey.getPublic);
  }
}
