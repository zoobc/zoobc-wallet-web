/**
 * @fileoverview gRPC-Web generated client stub for service
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


import * as grpcWeb from 'grpc-web';

import * as model_nodeRegistration_pb from '../model/nodeRegistration_pb';
import * as google_api_annotations_pb from '../google/api/annotations_pb';

export class NodeRegistrationServiceClient {
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

  methodInfoGetNodeRegistrations = new grpcWeb.AbstractClientBase.MethodInfo(
    model_nodeRegistration_pb.GetNodeRegistrationsResponse,
    (request: model_nodeRegistration_pb.GetNodeRegistrationsRequest) => {
      return request.serializeBinary();
    },
    model_nodeRegistration_pb.GetNodeRegistrationsResponse.deserializeBinary
  );

  getNodeRegistrations(
    request: model_nodeRegistration_pb.GetNodeRegistrationsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_nodeRegistration_pb.GetNodeRegistrationsResponse) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.NodeRegistrationService/GetNodeRegistrations',
      request,
      metadata || {},
      this.methodInfoGetNodeRegistrations,
      callback);
  }

  methodInfoGetNodeRegistration = new grpcWeb.AbstractClientBase.MethodInfo(
    model_nodeRegistration_pb.NodeRegistration,
    (request: model_nodeRegistration_pb.GetNodeRegistrationRequest) => {
      return request.serializeBinary();
    },
    model_nodeRegistration_pb.NodeRegistration.deserializeBinary
  );

  getNodeRegistration(
    request: model_nodeRegistration_pb.GetNodeRegistrationRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: model_nodeRegistration_pb.NodeRegistration) => void) {
    return this.client_.rpcCall(
      this.hostname_ +
        '/service.NodeRegistrationService/GetNodeRegistration',
      request,
      metadata || {},
      this.methodInfoGetNodeRegistration,
      callback);
  }

}

