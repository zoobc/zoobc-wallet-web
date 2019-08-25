import { Injectable } from '@angular/core';

import { TransactionServiceClient } from '../grpc/service/transactionServiceClientPb';
import {
  GetTransactionsRequest,
  GetTransactionsResponse,
  PostTransactionRequest,
  PostTransactionResponse,
} from '../grpc/model/transaction_pb';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { readInt64 } from 'src/helpers/converters';
import { Contact, ContactService } from './contact.service';

export interface Transaction {
  alias: string;
  address: string;
  timestamp: number;
  fee: number;
  type: string;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  txServ: TransactionServiceClient;

  constructor(
    private authServ: AuthService,
    private contactServ: ContactService
  ) {
    this.txServ = new TransactionServiceClient(environment.grpcUrl, null, null);
  }

  getAccountTransaction(page: number, limit: number) {
    const address = this.authServ.currAddress;
    return new Promise((resolve, reject) => {
      const request = new GetTransactionsRequest();
      request.setAccountaddress(address);
      request.setLimit(limit);
      request.setPage(page);

      this.txServ.getTransactions(
        request,
        null,
        (err, response: GetTransactionsResponse) => {
          if (err) return reject(err);

          console.log(response.toObject());

          // console.log(
          //   Buffer.from(JSON.stringify(response.toObject().transactionsList[1]))
          // );

          // filter transactions for only showing send coin type (type 1) (TEMP)
          const originTx = response.toObject().transactionsList.filter(tx => {
            if (tx.transactiontype == 1) return tx;
            else return false;
          });

          // recreate list of transactions
          let transactions: Transaction[] = originTx.map(tx => {
            const bytes = Buffer.from(
              tx.transactionbodybytes.toString(),
              'base64'
            );
            const amount = readInt64(bytes, 0);
            const friendAddress =
              tx.senderaccountaddress == address
                ? tx.recipientaccountaddress
                : tx.senderaccountaddress;
            const type =
              tx.senderaccountaddress == address ? 'send' : 'receive';
            const alias =
              this.contactServ.getContact(friendAddress).alias || '';

            return {
              alias: alias,
              address: friendAddress,
              type: type,
              timestamp: parseInt(tx.timestamp) * 1000,
              fee: parseInt(tx.fee),
              amount: amount,
            };
          });

          resolve(transactions);
        }
      );
    });
  }

  postTransaction(txBytes) {
    console.log(txBytes);

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
