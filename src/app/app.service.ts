import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AppService implements CanActivate {
  // private sourceCurrPublicKey = new BehaviorSubject("169,179,175,43,250,68,156,57,49,173,179,170,82,74,66,106,186,235,27,56,68,235,10,19,197,151,48,223,37,186,121,84");
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
