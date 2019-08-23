/**
 * @fileoverview gRPC-Web generated client stub for service
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as model_proofOfOwnership_pb from '../model/proofOfOwnership_pb';
import * as google_api_annotations_pb from '../google/api/annotations_pb';

export class NodeAdminServiceClient {
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

  methodInfoGetProofOfOwnership = new grpcWeb.AbstractClientBase.MethodInfo(
    model_proofOfOwnership_pb.ProofOfOwnership,
    (request: model_proofOfOwnership_pb.GetProofOfOwnershipRequest) => {
      return request.serializeBinary();
    },
    model_proofOfOwnership_pb.ProofOfOwnership.deserializeBinary
  );

  getProofOfOwnership(
    request: model_proofOfOwnership_pb.GetProofOfOwnershipRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_proofOfOwnership_pb.ProofOfOwnership) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.NodeAdminService/GetProofOfOwnership',
      request,
      metadata || {},
      this.methodInfoGetProofOfOwnership,
      callback);
  }

}

