import { Injectable } from '@angular/core';

import { TransactionServiceClient } from '../grpc/service/transactionServiceClientPb';
import {
  GetTransactionsByAccountPublicKeyRequest,
  GetTransactionsResponse,
  PostTransactionRequest,
  PostTransactionResponse,
} from '../grpc/model/transaction_pb';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  txServ: TransactionServiceClient;

  constructor(private authServ: AuthService) {
    this.txServ = new TransactionServiceClient(environment.grpcUrl, null, null);
  }

  getAccountTransaction() {
    let publicKey = this.authServ.currPublicKey;
    return new Promise((resolve, reject) => {
      const request = new GetTransactionsByAccountPublicKeyRequest();
      request.setAccountpublickey(publicKey);

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

  postTransaction(txBytes) {
    return new Promise((resolve, reject) => {
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
