import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { AppService } from "../app.service";

@Injectable({
  providedIn: "root"
})
export class AccountService {
  AccountTransaction = [];
  PublicKey: string = "";
  apiUrl = "http://54.254.196.180:8000";

  constructor(private http: HttpClient, private appServ: AppService) {
    appServ.currAccount.subscribe(account => {
      this.PublicKey = account;
    });
  }
  getAccountTransaction() {
    return this.http.get(
      `${this.apiUrl}/getAccountTransactions/${this.PublicKey}`
    );
  }
  getAccountBalance(){
    return this.http.get(`${this.apiUrl}/getBalance/${this.PublicKey}`);
  }

  sendMoney(data) {
    return this.http.post(`${this.apiUrl}/sendMoney`, data);
  }
}
