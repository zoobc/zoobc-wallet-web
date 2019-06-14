/**
 * @fileoverview gRPC-Web generated client stub for service
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as model_transaction_pb from '../model/transaction_pb';

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

  methodInfoGetTransactionsByAccountPublicKey = new grpcWeb.AbstractClientBase.MethodInfo(
    model_transaction_pb.GetTransactionsResponse,
    (request: model_transaction_pb.GetTransactionsByAccountPublicKeyRequest) => {
      return request.serializeBinary();
    },
    model_transaction_pb.GetTransactionsResponse.deserializeBinary
  );

  getTransactionsByAccountPublicKey(
    request: model_transaction_pb.GetTransactionsByAccountPublicKeyRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_transaction_pb.GetTransactionsResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.TransactionService/GetTransactionsByAccountPublicKey',
      request,
      metadata || {},
      this.methodInfoGetTransactionsByAccountPublicKey,
      callback);
  }

  methodInfoGetTransactionsByBlockID = new grpcWeb.AbstractClientBase.MethodInfo(
    model_transaction_pb.GetTransactionsResponse,
    (request: model_transaction_pb.GetTransactionsByBlockIDRequest) => {
      return request.serializeBinary();
    },
    model_transaction_pb.GetTransactionsResponse.deserializeBinary
  );

  getTransactionsByBlockID(
    request: model_transaction_pb.GetTransactionsByBlockIDRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_transaction_pb.GetTransactionsResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.TransactionService/GetTransactionsByBlockID',
      request,
      metadata || {},
      this.methodInfoGetTransactionsByBlockID,
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

