import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AppService } from "../app.service";
import { AccountBalancesServiceClient } from "../grpc/service/accountBalanceServiceClientPb";
import { TransactionServiceClient } from "../grpc/service/transactionServiceClientPb";
import {
  GetAccountBalanceRequest,
  AccountBalance
} from "../grpc/model/accountBalance_pb";
import {
  GetTransactionsByAccountPublicKeyRequest,
  GetTransactionsResponse
} from "../grpc/model/transaction_pb";

@Injectable({
  providedIn: "root"
})
export class AccountService {
  client: AccountBalancesServiceClient;
  txServ: TransactionServiceClient;

  AccountTransaction = [];
  PublicKey: string = "";
  apiUrl = "http://54.254.196.180:8000";
  grpcUrl = "http://18.139.3.139:8080";

  constructor(private http: HttpClient, private appServ: AppService) {
    appServ.currAccount.subscribe(account => {
      this.PublicKey = account;
    });
    this.client = new AccountBalancesServiceClient(this.grpcUrl, null, null);
    this.txServ = new TransactionServiceClient(this.grpcUrl, null, null);
  }
  getAccountTransaction() {
    return new Promise((resolve, reject) => {
      const request = new GetTransactionsByAccountPublicKeyRequest();
      request.setAccountpublickey(this.PublicKey);

      this.txServ.getTransactionsByAccountPublicKey(
        request,
        null,
        (err, response: GetTransactionsResponse) => {
          if (err) return reject(err);
          resolve(response.toObject());
        }
      );
    });
  }
  getAccountBalance() {
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();
      request.setPublickey(this.PublicKey);

      this.client.getAccountBalance(
        request,
        null,
        (err, response: AccountBalance) => {
          if (err) return reject(err)
          resolve(response.toObject())
        }
      );
    });
  }

  sendMoney(data) {
    return this.http.post(`${this.apiUrl}/sendMoney`, data);
  }
}
