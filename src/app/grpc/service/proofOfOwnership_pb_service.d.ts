// package: service
// file: service/proofOfOwnership.proto

import * as service_proofOfOwnership_pb from '../service/proofOfOwnership_pb';
import * as model_proofOfOwnership_pb from '../model/proofOfOwnership_pb';
import { grpc } from '@improbable-eng/grpc-web';

type NodeAdminServiceGetProofOfOwnership = {
  readonly methodName: string;
  readonly service: typeof NodeAdminService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_proofOfOwnership_pb.GetProofOfOwnershipRequest;
  readonly responseType: typeof model_proofOfOwnership_pb.ProofOfOwnership;
};

export class NodeAdminService {
  static readonly serviceName: string;
  static readonly GetProofOfOwnership: NodeAdminServiceGetProofOfOwnership;
}

export type ServiceError = {
  message: string;
  code: number;
  metadata: grpc.Metadata;
};
export type Status = { details: string; code: number; metadata: grpc.Metadata };

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
  on(
    type: 'data',
    handler: (message: ResT) => void
  ): BidirectionalStream<ReqT, ResT>;
  on(
    type: 'end',
    handler: (status?: Status) => void
  ): BidirectionalStream<ReqT, ResT>;
  on(
    type: 'status',
    handler: (status: Status) => void
  ): BidirectionalStream<ReqT, ResT>;
}

export class NodeAdminServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getProofOfOwnership(
    requestMessage: model_proofOfOwnership_pb.GetProofOfOwnershipRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: model_proofOfOwnership_pb.ProofOfOwnership | null
    ) => void
  ): UnaryResponse;
  getProofOfOwnership(
    requestMessage: model_proofOfOwnership_pb.GetProofOfOwnershipRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: model_proofOfOwnership_pb.ProofOfOwnership | null
    ) => void
  ): UnaryResponse;
}
