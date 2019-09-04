// package: service
// file: service/p2pCommunication.proto

import * as service_p2pCommunication_pb from "../service/p2pCommunication_pb";
import * as model_peer_pb from "../model/peer_pb";
import * as model_node_pb from "../model/node_pb";
import * as model_empty_pb from "../model/empty_pb";
import * as model_block_pb from "../model/block_pb";
import * as model_blockchain_pb from "../model/blockchain_pb";
import * as model_transaction_pb from "../model/transaction_pb";
import {grpc} from "@improbable-eng/grpc-web";

type P2PCommunicationGetPeerInfo = {
  readonly methodName: string;
  readonly service: typeof P2PCommunication;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_peer_pb.GetPeerInfoRequest;
  readonly responseType: typeof model_node_pb.Node;
};

type P2PCommunicationGetMorePeers = {
  readonly methodName: string;
  readonly service: typeof P2PCommunication;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_empty_pb.Empty;
  readonly responseType: typeof model_peer_pb.GetMorePeersResponse;
};

type P2PCommunicationSendPeers = {
  readonly methodName: string;
  readonly service: typeof P2PCommunication;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_peer_pb.SendPeersRequest;
  readonly responseType: typeof model_empty_pb.Empty;
};

type P2PCommunicationSendBlock = {
  readonly methodName: string;
  readonly service: typeof P2PCommunication;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_block_pb.Block;
  readonly responseType: typeof model_empty_pb.Empty;
};

type P2PCommunicationSendTransaction = {
  readonly methodName: string;
  readonly service: typeof P2PCommunication;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_transaction_pb.SendTransactionRequest;
  readonly responseType: typeof model_empty_pb.Empty;
};

type P2PCommunicationGetCumulativeDifficulty = {
  readonly methodName: string;
  readonly service: typeof P2PCommunication;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_blockchain_pb.GetCumulativeDifficultyRequest;
  readonly responseType: typeof model_blockchain_pb.GetCumulativeDifficultyResponse;
};

type P2PCommunicationGetCommonMilestoneBlockIDs = {
  readonly methodName: string;
  readonly service: typeof P2PCommunication;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_blockchain_pb.GetCommonMilestoneBlockIdsRequest;
  readonly responseType: typeof model_blockchain_pb.GetCommonMilestoneBlockIdsResponse;
};

type P2PCommunicationGetNextBlockIDs = {
  readonly methodName: string;
  readonly service: typeof P2PCommunication;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_block_pb.GetNextBlockIdsRequest;
  readonly responseType: typeof model_block_pb.BlockIdsResponse;
};

type P2PCommunicationGetNextBlocks = {
  readonly methodName: string;
  readonly service: typeof P2PCommunication;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_block_pb.GetNextBlocksRequest;
  readonly responseType: typeof model_block_pb.BlocksData;
};

export class P2PCommunication {
  static readonly serviceName: string;
  static readonly GetPeerInfo: P2PCommunicationGetPeerInfo;
  static readonly GetMorePeers: P2PCommunicationGetMorePeers;
  static readonly SendPeers: P2PCommunicationSendPeers;
  static readonly SendBlock: P2PCommunicationSendBlock;
  static readonly SendTransaction: P2PCommunicationSendTransaction;
  static readonly GetCumulativeDifficulty: P2PCommunicationGetCumulativeDifficulty;
  static readonly GetCommonMilestoneBlockIDs: P2PCommunicationGetCommonMilestoneBlockIDs;
  static readonly GetNextBlockIDs: P2PCommunicationGetNextBlockIDs;
  static readonly GetNextBlocks: P2PCommunicationGetNextBlocks;
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

export class P2PCommunicationClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getPeerInfo(
    requestMessage: model_peer_pb.GetPeerInfoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_node_pb.Node|null) => void
  ): UnaryResponse;
  getPeerInfo(
    requestMessage: model_peer_pb.GetPeerInfoRequest,
    callback: (error: ServiceError|null, responseMessage: model_node_pb.Node|null) => void
  ): UnaryResponse;
  getMorePeers(
    requestMessage: model_empty_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_peer_pb.GetMorePeersResponse|null) => void
  ): UnaryResponse;
  getMorePeers(
    requestMessage: model_empty_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: model_peer_pb.GetMorePeersResponse|null) => void
  ): UnaryResponse;
  sendPeers(
    requestMessage: model_peer_pb.SendPeersRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_empty_pb.Empty|null) => void
  ): UnaryResponse;
  sendPeers(
    requestMessage: model_peer_pb.SendPeersRequest,
    callback: (error: ServiceError|null, responseMessage: model_empty_pb.Empty|null) => void
  ): UnaryResponse;
  sendBlock(
    requestMessage: model_block_pb.Block,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_empty_pb.Empty|null) => void
  ): UnaryResponse;
  sendBlock(
    requestMessage: model_block_pb.Block,
    callback: (error: ServiceError|null, responseMessage: model_empty_pb.Empty|null) => void
  ): UnaryResponse;
  sendTransaction(
    requestMessage: model_transaction_pb.SendTransactionRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_empty_pb.Empty|null) => void
  ): UnaryResponse;
  sendTransaction(
    requestMessage: model_transaction_pb.SendTransactionRequest,
    callback: (error: ServiceError|null, responseMessage: model_empty_pb.Empty|null) => void
  ): UnaryResponse;
  getCumulativeDifficulty(
    requestMessage: model_blockchain_pb.GetCumulativeDifficultyRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_blockchain_pb.GetCumulativeDifficultyResponse|null) => void
  ): UnaryResponse;
  getCumulativeDifficulty(
    requestMessage: model_blockchain_pb.GetCumulativeDifficultyRequest,
    callback: (error: ServiceError|null, responseMessage: model_blockchain_pb.GetCumulativeDifficultyResponse|null) => void
  ): UnaryResponse;
  getCommonMilestoneBlockIDs(
    requestMessage: model_blockchain_pb.GetCommonMilestoneBlockIdsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_blockchain_pb.GetCommonMilestoneBlockIdsResponse|null) => void
  ): UnaryResponse;
  getCommonMilestoneBlockIDs(
    requestMessage: model_blockchain_pb.GetCommonMilestoneBlockIdsRequest,
    callback: (error: ServiceError|null, responseMessage: model_blockchain_pb.GetCommonMilestoneBlockIdsResponse|null) => void
  ): UnaryResponse;
  getNextBlockIDs(
    requestMessage: model_block_pb.GetNextBlockIdsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_block_pb.BlockIdsResponse|null) => void
  ): UnaryResponse;
  getNextBlockIDs(
    requestMessage: model_block_pb.GetNextBlockIdsRequest,
    callback: (error: ServiceError|null, responseMessage: model_block_pb.BlockIdsResponse|null) => void
  ): UnaryResponse;
  getNextBlocks(
    requestMessage: model_block_pb.GetNextBlocksRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_block_pb.BlocksData|null) => void
  ): UnaryResponse;
  getNextBlocks(
    requestMessage: model_block_pb.GetNextBlocksRequest,
    callback: (error: ServiceError|null, responseMessage: model_block_pb.BlocksData|null) => void
  ): UnaryResponse;
}

