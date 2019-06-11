import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AppService implements CanActivate {
  private sourceCurrAccount = new BehaviorSubject("01557a5d8b101b29a930400b5b83a346dc39e107");
  currAccount = this.sourceCurrAccount.asObservable();

  constructor(private router: Router) {}

  changeCurrentAccount(pubKey) {
    this.sourceCurrAccount.next(pubKey);
  }

  getAllAccount() {
    return JSON.parse(localStorage.getItem("accounts")) || [];
  }

  updateAllAccount(pubKey) {
    let accounts = this.getAllAccount();
    let isDuplicate = accounts.find(key => key == pubKey);

    if (!isDuplicate) {
      accounts.push(pubKey);
      localStorage.setItem("accounts", JSON.stringify(accounts));
    }
  }

  canActivate(): boolean {
    let pubKey = "";
    this.currAccount.subscribe(account => {
      pubKey = account;
    });

    if (pubKey) return true;
    
    this.router.navigateByUrl("/login");
    return false;
  }
}
