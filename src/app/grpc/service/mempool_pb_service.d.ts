// package: service
// file: service/mempool.proto

import * as service_mempool_pb from "../service/mempool_pb";
import * as model_mempool_pb from "../model/mempool_pb";
import {grpc} from "@improbable-eng/grpc-web";

type MempoolServiceGetMempoolTransactions = {
  readonly methodName: string;
  readonly service: typeof MempoolService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_mempool_pb.GetMempoolTransactionsRequest;
  readonly responseType: typeof model_mempool_pb.GetMempoolTransactionsResponse;
};

type MempoolServiceGetMempoolTransaction = {
  readonly methodName: string;
  readonly service: typeof MempoolService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_mempool_pb.GetMempoolTransactionRequest;
  readonly responseType: typeof model_mempool_pb.GetMempoolTransactionResponse;
};

export class MempoolService {
  static readonly serviceName: string;
  static readonly GetMempoolTransactions: MempoolServiceGetMempoolTransactions;
  static readonly GetMempoolTransaction: MempoolServiceGetMempoolTransaction;
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

export class MempoolServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getMempoolTransactions(
    requestMessage: model_mempool_pb.GetMempoolTransactionsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_mempool_pb.GetMempoolTransactionsResponse|null) => void
  ): UnaryResponse;
  getMempoolTransactions(
    requestMessage: model_mempool_pb.GetMempoolTransactionsRequest,
    callback: (error: ServiceError|null, responseMessage: model_mempool_pb.GetMempoolTransactionsResponse|null) => void
  ): UnaryResponse;
  getMempoolTransaction(
    requestMessage: model_mempool_pb.GetMempoolTransactionRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_mempool_pb.GetMempoolTransactionResponse|null) => void
  ): UnaryResponse;
  getMempoolTransaction(
    requestMessage: model_mempool_pb.GetMempoolTransactionRequest,
    callback: (error: ServiceError|null, responseMessage: model_mempool_pb.GetMempoolTransactionResponse|null) => void
  ): UnaryResponse;
}

