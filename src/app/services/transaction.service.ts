import { Injectable } from '@angular/core';
import { grpc } from '@improbable-eng/grpc-web';

import {
  GetTransactionsRequest,
  GetTransactionsResponse,
  PostTransactionRequest,
  PostTransactionResponse,
} from '../grpc/model/transaction_pb';
import {
  GetMempoolTransactionsRequest,
  GetMempoolTransactionsResponse,
} from '../grpc/model/mempool_pb';
import { TransactionService as TransactionServ } from '../grpc/service/transaction_pb_service';
import { MempoolService } from '../grpc/service/mempool_pb_service';

import { environment } from '../../environments/environment';
import { readInt64 } from 'src/helpers/converters';
import { AuthService } from './auth.service';
import { ContactService } from './contact.service';
import { Pagination, OrderBy } from '../grpc/model/pagination_pb';

export interface Transaction {
  alias: string;
  address: string;
  timestamp: number;
  fee: number;
  type: string;
  amount: number;
}

export interface Transactions {
  total: number;
  transactions: Transaction[];
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(
    private authServ: AuthService,
    private contactServ: ContactService
  ) {}

  getAccountTransaction(page: number, limit: number) {
    const address = this.authServ.currAddress;
    return new Promise((resolve, reject) => {
      const request = new GetTransactionsRequest();
      const pagination = new Pagination();
      pagination.setLimit(limit);
      pagination.setPage(page);
      pagination.setOrderby(OrderBy.DESC);
      request.setAccountaddress(address);
      request.setPagination(pagination);

      grpc.invoke(TransactionServ.GetTransactions, {
        request: request,
        host: environment.grpcUrl,
        onMessage: (message: GetTransactionsResponse) => {
          // filter transactions for only showing send coin type (type 1) (TEMP)
          const originTx = message.toObject().transactionsList.filter(tx => {
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

          resolve({
            total: message.toObject().total,
            transactions: transactions,
          });
        },
        onEnd: (
          code: grpc.Code,
          msg: string | undefined,
          trailers: grpc.Metadata
        ) => {
          if (code != grpc.Code.OK) reject(msg);
        },
      });
    });
  }

  getUnconfirmTransaction() {
    const address = this.authServ.currAddress;
    return new Promise((resolve, reject) => {
      const request = new GetMempoolTransactionsRequest();
      const pagination = new Pagination();
      pagination.setOrderby(OrderBy.DESC);
      request.setAddress(address);
      request.setPagination(pagination);

      grpc.invoke(MempoolService.GetMempoolTransactions, {
        request: request,
        host: environment.grpcUrl,
        onMessage: (message: GetMempoolTransactionsResponse) => {
          // recreate list of transactions
          let transactions = message
            .toObject()
            .mempooltransactionsList.map(tx => {
              const bytes = Buffer.from(
                tx.transactionbytes.toString(),
                'base64'
              );

              const amount = readInt64(bytes, 121);
              const fee = readInt64(bytes, 109);

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
                timestamp: parseInt(tx.arrivaltimestamp) * 1000,
                fee: fee,
                amount: amount,
              };
            });

          resolve(transactions);
        },
        onEnd: (
          code: grpc.Code,
          msg: string | undefined,
          trailers: grpc.Metadata
        ) => {
          if (code != grpc.Code.OK) reject(msg);
        },
      });
    });
  }

  postTransaction(txBytes) {
    return new Promise((resolve, reject) => {
      const request = new PostTransactionRequest();
      request.setTransactionbytes(txBytes);

      grpc.invoke(TransactionServ.PostTransaction, {
        request: request,
        host: environment.grpcUrl,
        onMessage: (message: PostTransactionResponse) => {
          resolve(message.toObject());
        },
        onEnd: (
          code: grpc.Code,
          msg: string | undefined,
          trailers: grpc.Metadata
        ) => {
          if (code != grpc.Code.OK) reject(msg);
        },
      });
    });
  }
}
