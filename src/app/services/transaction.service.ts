import { Injectable } from '@angular/core';

import { TransactionServiceClient } from '../grpc/service/transactionServiceClientPb';
import {
  GetTransactionsByAccountPublicKeyRequest,
  GetTransactionsResponse,
  PostTransactionRequest,
  PostTransactionResponse,
} from '../grpc/model/transaction_pb';
import { environment } from '../../environments/environment';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  txServ: TransactionServiceClient;

  constructor(private accServ: AccountService) {
    this.txServ = new TransactionServiceClient(environment.grpcUrl, null, null);
  }

  getAccountTransaction() {
    let publicKey = this.accServ.currPublicKey;
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
