import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AppService implements CanActivate {
  // private sourceCurrPublicKey = new BehaviorSubject("242,71,255,92,144,93,48,182,91,196,152,28,137,238,74,71,200,58,142,46,223,176,10,137,139,243,246,29,169,46,114,107");
  private sourceCurrPublicKey = new BehaviorSubject("");
  currPublicKey = this.sourceCurrPublicKey.asObservable();
  private sourceCurrAddress = new BehaviorSubject("");
  currAddress = this.sourceCurrAddress.asObservable();

  constructor(private router: Router) {}

  changeCurrentAccount(pubKey, address) {
    this.sourceCurrPublicKey.next(pubKey);
    this.sourceCurrAddress.next(address);
  }

  getAllAccount() {
    return JSON.parse(localStorage.getItem("accounts")) || [];
  }

  getPublicKey() {
    let publicKey: Uint8Array
    this.sourceCurrPublicKey.subscribe(account => {
      publicKey = new Uint8Array(account.split(",").map(Number));
    });
    return publicKey
  }

  getAddress() {
    let address: string
    this.sourceCurrAddress.subscribe(res => {
      address = res
    });
    return address
  }

  updateAllAccount(publicKey, address) {
    let accounts = this.getAllAccount();
    let isDuplicate = accounts.find(acc => acc.publicKey == publicKey);

    if (!isDuplicate) {
      accounts.push({ publicKey, address });
      localStorage.setItem("accounts", JSON.stringify(accounts));
    }
  }

  canActivate(): boolean {
    let pubKey = "";
    this.sourceCurrPublicKey.subscribe(account => {
      pubKey = account;
    });

    if (pubKey) return true;
    
    this.router.navigateByUrl("/login");
    return false;
  }
}
