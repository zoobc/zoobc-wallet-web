/**
 * @fileoverview gRPC-Web generated client stub for service
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as model_accountBalance_pb from '../model/accountBalance_pb';
import * as model_empty_pb from '../model/empty_pb';

export class AccountBalancesServiceClient {
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

  methodInfoGetAccountBalances = new grpcWeb.AbstractClientBase.MethodInfo(
    model_accountBalance_pb.GetAccountBalancesResponse,
    (request: model_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    model_accountBalance_pb.GetAccountBalancesResponse.deserializeBinary
  );

  getAccountBalances(
    request: model_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_accountBalance_pb.GetAccountBalancesResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.AccountBalancesService/GetAccountBalances',
      request,
      metadata || {},
      this.methodInfoGetAccountBalances,
      callback);
  }

  methodInfoGetAccountBalance = new grpcWeb.AbstractClientBase.MethodInfo(
    model_accountBalance_pb.AccountBalance,
    (request: model_accountBalance_pb.GetAccountBalanceRequest) => {
      return request.serializeBinary();
    },
    model_accountBalance_pb.AccountBalance.deserializeBinary
  );

  getAccountBalance(
    request: model_accountBalance_pb.GetAccountBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_accountBalance_pb.AccountBalance) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.AccountBalancesService/GetAccountBalance',
      request,
      metadata || {},
      this.methodInfoGetAccountBalance,
      callback);
  }

}

