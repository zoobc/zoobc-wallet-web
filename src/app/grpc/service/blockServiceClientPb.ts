/**
 * @fileoverview gRPC-Web generated client stub for service
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as model_block_pb from '../model/block_pb';
import * as google_api_annotations_pb from '../google/api/annotations_pb';

export class BlockServiceClient {
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

  methodInfoGetBlocks = new grpcWeb.AbstractClientBase.MethodInfo(
    model_block_pb.GetBlocksResponse,
    (request: model_block_pb.GetBlocksRequest) => {
      return request.serializeBinary();
    },
    model_block_pb.GetBlocksResponse.deserializeBinary
  );

  getBlocks(
    request: model_block_pb.GetBlocksRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_block_pb.GetBlocksResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.BlockService/GetBlocks',
      request,
      metadata || {},
      this.methodInfoGetBlocks,
      callback);
  }

  methodInfoGetBlock = new grpcWeb.AbstractClientBase.MethodInfo(
    model_block_pb.Block,
    (request: model_block_pb.GetBlockRequest) => {
      return request.serializeBinary();
    },
    model_block_pb.Block.deserializeBinary
  );

  getBlock(
    request: model_block_pb.GetBlockRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_block_pb.Block) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.BlockService/GetBlock',
      request,
      metadata || {},
      this.methodInfoGetBlock,
      callback);
  }

}

