// package: service
// file: service/host.proto

import * as service_host_pb from "../service/host_pb";
import * as model_empty_pb from "../model/empty_pb";
import * as model_host_pb from "../model/host_pb";
import {grpc} from "@improbable-eng/grpc-web";

type HostServiceGetHostInfo = {
  readonly methodName: string;
  readonly service: typeof HostService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_empty_pb.Empty;
  readonly responseType: typeof model_host_pb.HostInfo;
};

type HostServiceGetHostPeers = {
  readonly methodName: string;
  readonly service: typeof HostService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_empty_pb.Empty;
  readonly responseType: typeof model_host_pb.GetHostPeersResponse;
};

export class HostService {
  static readonly serviceName: string;
  static readonly GetHostInfo: HostServiceGetHostInfo;
  static readonly GetHostPeers: HostServiceGetHostPeers;
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

export class HostServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getHostInfo(
    requestMessage: model_empty_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_host_pb.HostInfo|null) => void
  ): UnaryResponse;
  getHostInfo(
    requestMessage: model_empty_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: model_host_pb.HostInfo|null) => void
  ): UnaryResponse;
  getHostPeers(
    requestMessage: model_empty_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_host_pb.GetHostPeersResponse|null) => void
  ): UnaryResponse;
  getHostPeers(
    requestMessage: model_empty_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: model_host_pb.GetHostPeersResponse|null) => void
  ): UnaryResponse;
}

