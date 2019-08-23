/**
 * @fileoverview gRPC-Web generated client stub for service
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as model_empty_pb from '../model/empty_pb';
import * as model_host_pb from '../model/host_pb';
import * as google_api_annotations_pb from '../google/api/annotations_pb';

export class HostServiceClient {
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

  methodInfoGetHostInfo = new grpcWeb.AbstractClientBase.MethodInfo(
    model_host_pb.HostInfo,
    (request: model_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    model_host_pb.HostInfo.deserializeBinary
  );

  getHostInfo(
    request: model_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_host_pb.HostInfo) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.HostService/GetHostInfo',
      request,
      metadata || {},
      this.methodInfoGetHostInfo,
      callback);
  }

  methodInfoGetHostPeers = new grpcWeb.AbstractClientBase.MethodInfo(
    model_host_pb.GetHostPeersResponse,
    (request: model_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    model_host_pb.GetHostPeersResponse.deserializeBinary
  );

  getHostPeers(
    request: model_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_host_pb.GetHostPeersResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.HostService/GetHostPeers',
      request,
      metadata || {},
      this.methodInfoGetHostPeers,
      callback);
  }

}

