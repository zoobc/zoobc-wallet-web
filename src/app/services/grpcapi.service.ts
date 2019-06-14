import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as sha512 from 'js-sha512';
import { AppService } from '../app.service';

import { AccountBalancesServiceClient } from '../grpc/service/accountBalanceServiceClientPb';
import { TransactionServiceClient } from '../grpc/service/transactionServiceClientPb';

import {
  GetAccountBalanceRequest,
  AccountBalance
} from '../grpc/model/accountBalance_pb';
import {
  GetTransactionsByAccountPublicKeyRequest,
  GetTransactionsResponse,
  PostTransactionRequest,
  PostTransactionResponse
} from '../grpc/model/transaction_pb';

@Injectable({
  providedIn: 'root'
})
export class GrpcapiService {
  client: AccountBalancesServiceClient;
  txServ: TransactionServiceClient;

  AccountTransaction = [];
  PublicKey: Uint8Array;

  apiUrl = 'http://54.254.196.180:8000';
  grpcUrl = 'http://18.139.3.139:8080';

  constructor(private http: HttpClient, private appServ: AppService) {
    this.PublicKey = appServ.getPublicKey()
  }

  getAccountTransaction() {
    this.txServ = new TransactionServiceClient(this.grpcUrl, null, null);
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
    this.client = new AccountBalancesServiceClient(this.grpcUrl, null, null);
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();
      console.log(this.PublicKey);
      request.setPublickey(this.PublicKey);

      this.client.getAccountBalance(
        request,
        null,
        (err, response: AccountBalance) => {
          if (err) return reject(err);
          resolve(response.toObject());
        }
      );
    });
  }

  postTransaction(txBytes) {
    this.txServ = new TransactionServiceClient(this.grpcUrl, null, null);
    // return this.http.post(`${this.apiUrl}/sendMoney`, data);

    return new Promise((resolve, reject) => {
      // const {
      //   recipient,
      //   amount,
      //   fee,
      //   from,
      //   senderPublicKey,
      //   signatureHash,
      //   timestamp
      // } = data;
      // let dataString = `${recipient}${amount}${fee}${from}${senderPublicKey}${signatureHash}${timestamp}`;
      // let dataSHA = sha512.sha512(dataString);

      // const binary_string = window.atob(dataSHA);
      // const len = binary_string.length;
      // const dataBytes = new Uint8Array(len);
      // for (let i = 0; i < len; i++) {
      //   dataBytes[i] = binary_string.charCodeAt(i);
      // }

      const request = new PostTransactionRequest();
      request.setTransactionbytes(txBytes);

      this.txServ.postTransaction(
        request,
        null,
        (err, response: PostTransactionResponse) => {
          if (err) return reject(err);
          resolve(response.toObject());
        }
      );
    });
  }

}
