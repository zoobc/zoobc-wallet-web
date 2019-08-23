/**
 * @fileoverview gRPC-Web generated client stub for service
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as model_peer_pb from '../model/peer_pb';
import * as model_node_pb from '../model/node_pb';
import * as model_empty_pb from '../model/empty_pb';
import * as model_block_pb from '../model/block_pb';
import * as model_blockchain_pb from '../model/blockchain_pb';
import * as model_transaction_pb from '../model/transaction_pb';

export class P2PCommunicationClient {
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

  methodInfoGetPeerInfo = new grpcWeb.AbstractClientBase.MethodInfo(
    model_node_pb.Node,
    (request: model_peer_pb.GetPeerInfoRequest) => {
      return request.serializeBinary();
    },
    model_node_pb.Node.deserializeBinary
  );

  getPeerInfo(
    request: model_peer_pb.GetPeerInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_node_pb.Node) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.P2PCommunication/GetPeerInfo',
      request,
      metadata || {},
      this.methodInfoGetPeerInfo,
      callback);
  }

  methodInfoGetMorePeers = new grpcWeb.AbstractClientBase.MethodInfo(
    model_peer_pb.GetMorePeersResponse,
    (request: model_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    model_peer_pb.GetMorePeersResponse.deserializeBinary
  );

  getMorePeers(
    request: model_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_peer_pb.GetMorePeersResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.P2PCommunication/GetMorePeers',
      request,
      metadata || {},
      this.methodInfoGetMorePeers,
      callback);
  }

  methodInfoSendPeers = new grpcWeb.AbstractClientBase.MethodInfo(
    model_empty_pb.Empty,
    (request: model_peer_pb.SendPeersRequest) => {
      return request.serializeBinary();
    },
    model_empty_pb.Empty.deserializeBinary
  );

  sendPeers(
    request: model_peer_pb.SendPeersRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_empty_pb.Empty) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.P2PCommunication/SendPeers',
      request,
      metadata || {},
      this.methodInfoSendPeers,
      callback);
  }

  methodInfoSendBlock = new grpcWeb.AbstractClientBase.MethodInfo(
    model_empty_pb.Empty,
    (request: model_block_pb.Block) => {
      return request.serializeBinary();
    },
    model_empty_pb.Empty.deserializeBinary
  );

  sendBlock(
    request: model_block_pb.Block,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_empty_pb.Empty) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.P2PCommunication/SendBlock',
      request,
      metadata || {},
      this.methodInfoSendBlock,
      callback);
  }

  methodInfoSendTransaction = new grpcWeb.AbstractClientBase.MethodInfo(
    model_empty_pb.Empty,
    (request: model_transaction_pb.SendTransactionRequest) => {
      return request.serializeBinary();
    },
    model_empty_pb.Empty.deserializeBinary
  );

  sendTransaction(
    request: model_transaction_pb.SendTransactionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_empty_pb.Empty) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.P2PCommunication/SendTransaction',
      request,
      metadata || {},
      this.methodInfoSendTransaction,
      callback);
  }

  methodInfoGetCumulativeDifficulty = new grpcWeb.AbstractClientBase.MethodInfo(
    model_blockchain_pb.GetCumulativeDifficultyResponse,
    (request: model_blockchain_pb.GetCumulativeDifficultyRequest) => {
      return request.serializeBinary();
    },
    model_blockchain_pb.GetCumulativeDifficultyResponse.deserializeBinary
  );

  getCumulativeDifficulty(
    request: model_blockchain_pb.GetCumulativeDifficultyRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_blockchain_pb.GetCumulativeDifficultyResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.P2PCommunication/GetCumulativeDifficulty',
      request,
      metadata || {},
      this.methodInfoGetCumulativeDifficulty,
      callback);
  }

  methodInfoGetCommonMilestoneBlockIDs = new grpcWeb.AbstractClientBase.MethodInfo(
    model_blockchain_pb.GetCommonMilestoneBlockIdsResponse,
    (request: model_blockchain_pb.GetCommonMilestoneBlockIdsRequest) => {
      return request.serializeBinary();
    },
    model_blockchain_pb.GetCommonMilestoneBlockIdsResponse.deserializeBinary
  );

  getCommonMilestoneBlockIDs(
    request: model_blockchain_pb.GetCommonMilestoneBlockIdsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_blockchain_pb.GetCommonMilestoneBlockIdsResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.P2PCommunication/GetCommonMilestoneBlockIDs',
      request,
      metadata || {},
      this.methodInfoGetCommonMilestoneBlockIDs,
      callback);
  }

  methodInfoGetNextBlockIDs = new grpcWeb.AbstractClientBase.MethodInfo(
    model_block_pb.BlockIdsResponse,
    (request: model_block_pb.GetNextBlockIdsRequest) => {
      return request.serializeBinary();
    },
    model_block_pb.BlockIdsResponse.deserializeBinary
  );

  getNextBlockIDs(
    request: model_block_pb.GetNextBlockIdsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_block_pb.BlockIdsResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.P2PCommunication/GetNextBlockIDs',
      request,
      metadata || {},
      this.methodInfoGetNextBlockIDs,
      callback);
  }

  methodInfoGetNextBlocks = new grpcWeb.AbstractClientBase.MethodInfo(
    model_block_pb.BlocksData,
    (request: model_block_pb.GetNextBlocksRequest) => {
      return request.serializeBinary();
    },
    model_block_pb.BlocksData.deserializeBinary
  );

  getNextBlocks(
    request: model_block_pb.GetNextBlocksRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_block_pb.BlocksData) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.P2PCommunication/GetNextBlocks',
      request,
      metadata || {},
      this.methodInfoGetNextBlocks,
      callback);
  }

}

