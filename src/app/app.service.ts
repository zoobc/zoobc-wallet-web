import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import * as CryptoJS from "crypto-js";
import * as bip32 from "bip32";
import { BIP32Interface } from "bip32";
import { GetAddressFromPublicKey } from "../helpers/utils";
import { byteArrayToHex, hexToByteArray } from "../helpers/converters";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class AppService implements CanActivate {
  private sourceCurrSeed = new BehaviorSubject("");
  private sourceCurrPublicKey = new BehaviorSubject("");
  private sourceCurrAddress = new BehaviorSubject("");
  private sourceCurrAccount = new BehaviorSubject(null);
  private sourceIsLoginPin = new BehaviorSubject(false);

  currSeed: BIP32Interface;
  currPublicKey: Uint8Array;
  currAddress: string;
  currAccount: { path: string; name: string };
  isLoginPin: boolean;

  constructor(private router: Router, private http: HttpClient) {
    this.sourceCurrSeed.subscribe(seedBase58 => {
      console.log(seedBase58);
      if (seedBase58) this.currSeed = bip32.fromBase58(seedBase58);
    });

    this.sourceCurrPublicKey.subscribe(pubKeyHex => {
      if (pubKeyHex) this.currPublicKey = hexToByteArray(pubKeyHex);
    });

    this.sourceCurrAddress.subscribe(address => {
      this.currAddress = address;
    });

    this.sourceCurrAccount.subscribe(idxAcc => {
      const accounts = JSON.parse(localStorage.getItem("accounts"));
      if (idxAcc != null) this.currAccount = accounts[idxAcc];
    });

    this.sourceIsLoginPin.subscribe(value => {
      this.isLoginPin = value;
    });
  }

  changeCurrentAccount(path: string) {
    const pin = localStorage.getItem("pin");

    if (pin) {
      const seedBase58 = CryptoJS.AES.decrypt(
        localStorage.getItem("encMasterSeed"),
        pin
      ).toString(CryptoJS.enc.Utf8);

      const masterSeed: BIP32Interface = bip32.fromBase58(seedBase58);
      const childSeed = masterSeed.derivePath(path);
      const publicKey = childSeed.publicKey.slice(1, 33);
      const address = GetAddressFromPublicKey(publicKey);

      const accounts = JSON.parse(localStorage.getItem("accounts"));
      const idxAcc = accounts.findIndex((acc: any) => acc.path == path);

      this.sourceCurrSeed.next(masterSeed.toBase58());
      this.sourceCurrPublicKey.next(byteArrayToHex(publicKey));
      this.sourceCurrAddress.next(address);
      this.sourceCurrAccount.next(idxAcc);
      // console.log(seed.toBase58());
      // console.log(byteArrayToHex(publicKey));
      // console.log(address);
      console.log(accounts[idxAcc]);
    }
  }

  getAllAccount() {
    return JSON.parse(localStorage.getItem("accounts")) || [];
  }

  updateAllAccount(path: string, name: string) {
    const accounts = this.getAllAccount();
    const isDuplicate = accounts.find(acc => acc.path === path);

    if (!isDuplicate) {
      accounts.push({ path, name });
      localStorage.setItem("accounts", JSON.stringify(accounts));
    }
  }

  saveMasterWallet(seedBase58: string) {
    const pin = localStorage.getItem("pin");
    if (pin) {
      const encSeed = CryptoJS.AES.encrypt(seedBase58, pin).toString();
      localStorage.setItem("encMasterSeed", encSeed);
    }
  }

  onLoginPin() {
    this.sourceIsLoginPin.next(true);
  }

  canActivate(): boolean {
    if (this.currPublicKey) return true;
    this.router.navigateByUrl("/login");
    return false;
  }

  getCurrencyRate() {
    return this.http.get("https://api.exchangeratesapi.io/latest?base=USD");
  }
}

// Language
export const LANGUAGES = [
  {
    country: "English",
    code: "en"
  },
  {
    country: "Indonesia",
    code: "id"
  }
];
