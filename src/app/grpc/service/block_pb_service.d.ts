// package: service
// file: service/block.proto

import * as service_block_pb from "../service/block_pb";
import * as model_block_pb from "../model/block_pb";
import {grpc} from "@improbable-eng/grpc-web";

type BlockServiceGetBlocks = {
  readonly methodName: string;
  readonly service: typeof BlockService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_block_pb.GetBlocksRequest;
  readonly responseType: typeof model_block_pb.GetBlocksResponse;
};

type BlockServiceGetBlock = {
  readonly methodName: string;
  readonly service: typeof BlockService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_block_pb.GetBlockRequest;
  readonly responseType: typeof model_block_pb.Block;
};

export class BlockService {
  static readonly serviceName: string;
  static readonly GetBlocks: BlockServiceGetBlocks;
  static readonly GetBlock: BlockServiceGetBlock;
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

export class BlockServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getBlocks(
    requestMessage: model_block_pb.GetBlocksRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_block_pb.GetBlocksResponse|null) => void
  ): UnaryResponse;
  getBlocks(
    requestMessage: model_block_pb.GetBlocksRequest,
    callback: (error: ServiceError|null, responseMessage: model_block_pb.GetBlocksResponse|null) => void
  ): UnaryResponse;
  getBlock(
    requestMessage: model_block_pb.GetBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_block_pb.Block|null) => void
  ): UnaryResponse;
  getBlock(
    requestMessage: model_block_pb.GetBlockRequest,
    callback: (error: ServiceError|null, responseMessage: model_block_pb.Block|null) => void
  ): UnaryResponse;
}

