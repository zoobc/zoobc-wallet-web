import { Injectable } from '@angular/core';
import { grpc } from '@improbable-eng/grpc-web';

import {
  GetTransactionsRequest,
  GetTransactionsResponse,
  PostTransactionRequest,
  PostTransactionResponse,
  GetTransactionRequest,
  Transaction as TransactionResponse,
} from '../grpc/model/transaction_pb';
import {
  GetMempoolTransactionsRequest,
  GetMempoolTransactionsResponse,
} from '../grpc/model/mempool_pb';
import { TransactionService as TransactionServ } from '../grpc/service/transaction_pb_service';
import { MempoolService } from '../grpc/service/mempool_pb_service';

import { environment } from '../../environments/environment';
import { readInt64 } from 'src/helpers/converters';
import { ContactService } from './contact.service';
import { Pagination, OrderBy } from '../grpc/model/pagination_pb';

export interface Transaction {
  id: string;
  alias: string;
  address: string;
  sender: string;
  recipient: string;
  timestamp: number;
  fee: number;
  type: string;
  amount: number;
  blockId: string;
  height: number;
  transactionIndex: number;
}

export interface Transactions {
  total: number;
  transactions: Transaction[];
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private contactServ: ContactService) {}

  getAccountTransaction(
    page: number,
    limit: number,
    address: string
  ): Promise<Transactions> {
    // const address = this.authServ.currAddress;
    return new Promise((resolve, reject) => {
      const request = new GetTransactionsRequest();
      const pagination = new Pagination();
      pagination.setLimit(limit);
      pagination.setPage(page);
      pagination.setOrderby(OrderBy.DESC);
      request.setAccountaddress(address);
      request.setPagination(pagination);
      request.setTransactiontype(1);

      grpc.invoke(TransactionServ.GetTransactions, {
        request: request,
        host: environment.grpcUrl,
        onMessage: (message: GetTransactionsResponse) => {
          // recreate list of transactions
          let transactions: Transaction[] = message
            .toObject()
            .transactionsList.map(tx => {
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
                id: tx.id,
                alias: alias,
                address: friendAddress,
                type: type,
                timestamp: parseInt(tx.timestamp) * 1000,
                fee: parseInt(tx.fee),
                amount: amount,
                blockId: tx.blockid,
                height: tx.height,
                transactionIndex: tx.transactionindex,
                sender: '',
                recipient: '',
              };
            });

          resolve({
            total: parseInt(message.toObject().total),
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

  getTransaction(id: string): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      const request = new GetTransactionRequest();
      request.setId(id);

      grpc.invoke(TransactionServ.GetTransaction, {
        request: request,
        host: environment.grpcUrl,
        onMessage: (message: TransactionResponse) => {
          let tx = message.toObject();

          const bytes = Buffer.from(
            tx.transactionbodybytes.toString(),
            'base64'
          );
          const amount = readInt64(bytes, 0);

          resolve({
            id: tx.id,
            alias: '',
            address: '',
            type: '',
            timestamp: parseInt(tx.timestamp) * 1000,
            fee: parseInt(tx.fee),
            amount: amount,
            blockId: tx.blockid,
            height: tx.height,
            transactionIndex: tx.transactionindex,
            sender: tx.senderaccountaddress,
            recipient: tx.recipientaccountaddress,
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

  getUnconfirmTransaction(address: string) {
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
