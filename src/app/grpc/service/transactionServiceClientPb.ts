/**
 * @fileoverview gRPC-Web generated client stub for service
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as model_transaction_pb from '../model/transaction_pb';
import * as google_api_annotations_pb from '../google/api/annotations_pb';

export class TransactionServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: string; };

  constructor (hostname: string,
               credentials: null | { [index: string]: string; },
               options: null | { [index: string]: string; }) {
    if (!options) options = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetTransactions = new grpcWeb.AbstractClientBase.MethodInfo(
    model_transaction_pb.GetTransactionsResponse,
    (request: model_transaction_pb.GetTransactionsRequest) => {
      return request.serializeBinary();
    },
    model_transaction_pb.GetTransactionsResponse.deserializeBinary
  );

  getTransactions(
    request: model_transaction_pb.GetTransactionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_transaction_pb.GetTransactionsResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.TransactionService/GetTransactions',
      request,
      metadata || {},
      this.methodInfoGetTransactions,
      callback);
  }

  methodInfoGetTransaction = new grpcWeb.AbstractClientBase.MethodInfo(
    model_transaction_pb.Transaction,
    (request: model_transaction_pb.GetTransactionRequest) => {
      return request.serializeBinary();
    },
    model_transaction_pb.Transaction.deserializeBinary
  );

  getTransaction(
    request: model_transaction_pb.GetTransactionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_transaction_pb.Transaction) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.TransactionService/GetTransaction',
      request,
      metadata || {},
      this.methodInfoGetTransaction,
      callback);
  }

  methodInfoPostTransaction = new grpcWeb.AbstractClientBase.MethodInfo(
    model_transaction_pb.PostTransactionResponse,
    (request: model_transaction_pb.PostTransactionRequest) => {
      return request.serializeBinary();
    },
    model_transaction_pb.PostTransactionResponse.deserializeBinary
  );

  postTransaction(
    request: model_transaction_pb.PostTransactionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_transaction_pb.PostTransactionResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.TransactionService/PostTransaction',
      request,
      metadata || {},
      this.methodInfoPostTransaction,
      callback);
  }

}

