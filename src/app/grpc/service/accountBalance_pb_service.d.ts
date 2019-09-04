// package: service
// file: service/accountBalance.proto

import * as service_accountBalance_pb from "../service/accountBalance_pb";
import * as model_accountBalance_pb from "../model/accountBalance_pb";
import {grpc} from "@improbable-eng/grpc-web";

type AccountBalanceServiceGetAccountBalances = {
  readonly methodName: string;
  readonly service: typeof AccountBalanceService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_accountBalance_pb.GetAccountBalancesRequest;
  readonly responseType: typeof model_accountBalance_pb.GetAccountBalancesResponse;
};

type AccountBalanceServiceGetAccountBalance = {
  readonly methodName: string;
  readonly service: typeof AccountBalanceService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_accountBalance_pb.GetAccountBalanceRequest;
  readonly responseType: typeof model_accountBalance_pb.GetAccountBalanceResponse;
};

export class AccountBalanceService {
  static readonly serviceName: string;
  static readonly GetAccountBalances: AccountBalanceServiceGetAccountBalances;
  static readonly GetAccountBalance: AccountBalanceServiceGetAccountBalance;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class AccountBalanceServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getAccountBalances(
    requestMessage: model_accountBalance_pb.GetAccountBalancesRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_accountBalance_pb.GetAccountBalancesResponse|null) => void
  ): UnaryResponse;
  getAccountBalances(
    requestMessage: model_accountBalance_pb.GetAccountBalancesRequest,
    callback: (error: ServiceError|null, responseMessage: model_accountBalance_pb.GetAccountBalancesResponse|null) => void
  ): UnaryResponse;
  getAccountBalance(
    requestMessage: model_accountBalance_pb.GetAccountBalanceRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_accountBalance_pb.GetAccountBalanceResponse|null) => void
  ): UnaryResponse;
  getAccountBalance(
    requestMessage: model_accountBalance_pb.GetAccountBalanceRequest,
    callback: (error: ServiceError|null, responseMessage: model_accountBalance_pb.GetAccountBalanceResponse|null) => void
  ): UnaryResponse;
}

