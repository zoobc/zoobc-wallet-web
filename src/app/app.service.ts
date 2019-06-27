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

  currSeed: BIP32Interface;
  currPublicKey: Uint8Array;
  currAddress: string;

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
      const account = accounts.find((acc: any) => acc.path == path);

      this.sourceCurrSeed.next(masterSeed.toBase58());
      this.sourceCurrPublicKey.next(byteArrayToHex(publicKey));
      this.sourceCurrAddress.next(address);

      localStorage.setItem("currAccount", JSON.stringify(account));
      // console.log(seed.toBase58());
      // console.log(byteArrayToHex(publicKey));
      // console.log(address);
    }
  }

  getCurrAccount() {
    return JSON.parse(localStorage.getItem("currAccount"));
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

  isLoggedIn() {
    return this.currPublicKey ? true : false;
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
