import { Injectable } from "@angular/core";

import { AccountBalancesServiceClient } from "../grpc/service/accountBalanceServiceClientPb";
import {
  GetAccountBalanceRequest,
  AccountBalance
} from "../grpc/model/accountBalance_pb";

import { environment } from "../../environments/environment";
import { AppService } from "../app.service";

@Injectable({
  providedIn: "root"
})
export class AccountService {
  accBalanceServ: AccountBalancesServiceClient;
  accounts: [] = JSON.parse(localStorage.getItem("accounts")) || [];

  constructor(private appServ: AppService) {
    this.accBalanceServ = new AccountBalancesServiceClient(
      environment.grpcUrl,
      null,
      null
    );
  }

  generateDerivationPath(): string {
    let isDuplicate: boolean = true;
    let path: string;
    while (isDuplicate) {
      const m1 = Math.floor(Math.random() * Math.pow(2, 31));
      const m2 = Math.floor(Math.random() * Math.pow(2, 31));

      path = `m/${m1}/${m2}`;
      isDuplicate = this.accounts.find((acc: any) => acc.path == path);
      console.log(path);
    }
    return path;
  }

  getAccountBalance() {
    let publicKey = this.appServ.currPublicKey;
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();
      request.setPublickey(publicKey);

      this.accBalanceServ.getAccountBalance(
        request,
        null,
        (err, response: AccountBalance) => {
          if (err) return reject(err);
          resolve(response.toObject());
        }
      );
    });
  }
}
