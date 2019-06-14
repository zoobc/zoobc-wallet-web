import { Injectable } from "@angular/core";
import * as sha512 from 'js-sha512';

import { TransactionServiceClient } from "../grpc/service/transactionServiceClientPb";
import {
  GetTransactionsByAccountPublicKeyRequest,
  GetTransactionsResponse,
  PostTransactionRequest,
  PostTransactionResponse
} from "../grpc/model/transaction_pb";

import { environment } from "../../environments/environment";
import { AppService } from '../app.service'

@Injectable({
  providedIn: "root"
})
export class TransactionService {

  txServ: TransactionServiceClient;
  publicKey: Uint8Array;

  constructor(private appServ: AppService) {
    this.publicKey = appServ.getPublicKey()
    this.txServ = new TransactionServiceClient(environment.grpcUrl, null, null);
  }

  getAccountTransaction() {
    this.txServ = new TransactionServiceClient(environment.grpcUrl, null, null);
    return new Promise((resolve, reject) => {
      const request = new GetTransactionsByAccountPublicKeyRequest();
      request.setAccountpublickey(this.publicKey);

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

  sendMoney(data) {
    this.txServ = new TransactionServiceClient(environment.grpcUrl, null, null);
    // return this.http.post(`${this.apiUrl}/sendMoney`, data);

    return new Promise((resolve, reject) => {
      const {
        recipient,
        amount,
        fee,
        passphrase,
        from,
        senderPublicKey,
        signatureHash
      } = data;
      let dataString = `${recipient}${amount}${fee}${passphrase}${from}${senderPublicKey}${signatureHash}`;
      let dataSHA = sha512.sha512(dataString);

      const binary_string = window.atob(dataSHA);
      const len = binary_string.length;
      const dataBytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        dataBytes[i] = binary_string.charCodeAt(i);
      }

      const request = new PostTransactionRequest();
      request.setTransactionbytes(dataBytes);

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
