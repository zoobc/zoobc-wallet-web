// package: service
// file: service/transaction.proto

import * as service_transaction_pb from "../service/transaction_pb";
import * as model_transaction_pb from "../model/transaction_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TransactionServiceGetTransactions = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_transaction_pb.GetTransactionsRequest;
  readonly responseType: typeof model_transaction_pb.GetTransactionsResponse;
};

type TransactionServiceGetTransaction = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_transaction_pb.GetTransactionRequest;
  readonly responseType: typeof model_transaction_pb.Transaction;
};

type TransactionServicePostTransaction = {
  readonly methodName: string;
  readonly service: typeof TransactionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_transaction_pb.PostTransactionRequest;
  readonly responseType: typeof model_transaction_pb.PostTransactionResponse;
};

export class TransactionService {
  static readonly serviceName: string;
  static readonly GetTransactions: TransactionServiceGetTransactions;
  static readonly GetTransaction: TransactionServiceGetTransaction;
  static readonly PostTransaction: TransactionServicePostTransaction;
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

export class TransactionServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getTransactions(
    requestMessage: model_transaction_pb.GetTransactionsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_transaction_pb.GetTransactionsResponse|null) => void
  ): UnaryResponse;
  getTransactions(
    requestMessage: model_transaction_pb.GetTransactionsRequest,
    callback: (error: ServiceError|null, responseMessage: model_transaction_pb.GetTransactionsResponse|null) => void
  ): UnaryResponse;
  getTransaction(
    requestMessage: model_transaction_pb.GetTransactionRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_transaction_pb.Transaction|null) => void
  ): UnaryResponse;
  getTransaction(
    requestMessage: model_transaction_pb.GetTransactionRequest,
    callback: (error: ServiceError|null, responseMessage: model_transaction_pb.Transaction|null) => void
  ): UnaryResponse;
  postTransaction(
    requestMessage: model_transaction_pb.PostTransactionRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_transaction_pb.PostTransactionResponse|null) => void
  ): UnaryResponse;
  postTransaction(
    requestMessage: model_transaction_pb.PostTransactionRequest,
    callback: (error: ServiceError|null, responseMessage: model_transaction_pb.PostTransactionResponse|null) => void
  ): UnaryResponse;
}

