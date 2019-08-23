/**
 * @fileoverview gRPC-Web generated client stub for service
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as model_mempool_pb from '../model/mempool_pb';
import * as google_api_annotations_pb from '../google/api/annotations_pb';

export class MempoolServiceClient {
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

  methodInfoGetMempoolTransactions = new grpcWeb.AbstractClientBase.MethodInfo(
    model_mempool_pb.GetMempoolTransactionsResponse,
    (request: model_mempool_pb.GetMempoolTransactionsRequest) => {
      return request.serializeBinary();
    },
    model_mempool_pb.GetMempoolTransactionsResponse.deserializeBinary
  );

  getMempoolTransactions(
    request: model_mempool_pb.GetMempoolTransactionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_mempool_pb.GetMempoolTransactionsResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.MempoolService/GetMempoolTransactions',
      request,
      metadata || {},
      this.methodInfoGetMempoolTransactions,
      callback);
  }

  methodInfoGetMempoolTransaction = new grpcWeb.AbstractClientBase.MethodInfo(
    model_mempool_pb.GetMempoolTransactionResponse,
    (request: model_mempool_pb.GetMempoolTransactionRequest) => {
      return request.serializeBinary();
    },
    model_mempool_pb.GetMempoolTransactionResponse.deserializeBinary
  );

  getMempoolTransaction(
    request: model_mempool_pb.GetMempoolTransactionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_mempool_pb.GetMempoolTransactionResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.MempoolService/GetMempoolTransaction',
      request,
      metadata || {},
      this.methodInfoGetMempoolTransaction,
      callback);
  }

}

