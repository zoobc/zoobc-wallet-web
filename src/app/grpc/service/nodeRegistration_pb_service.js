// package: service
// file: service/nodeRegistration.proto

var service_nodeRegistration_pb = require("../service/nodeRegistration_pb");
var model_nodeRegistration_pb = require("../model/nodeRegistration_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var NodeRegistrationService = (function () {
  function NodeRegistrationService() {}
  NodeRegistrationService.serviceName = "service.NodeRegistrationService";
  return NodeRegistrationService;
}());

NodeRegistrationService.GetNodeRegistrations = {
  methodName: "GetNodeRegistrations",
  service: NodeRegistrationService,
  requestStream: false,
  responseStream: false,
  requestType: model_nodeRegistration_pb.GetNodeRegistrationsRequest,
  responseType: model_nodeRegistration_pb.GetNodeRegistrationsResponse
};

NodeRegistrationService.GetNodeRegistration = {
  methodName: "GetNodeRegistration",
  service: NodeRegistrationService,
  requestStream: false,
  responseStream: false,
  requestType: model_nodeRegistration_pb.GetNodeRegistrationRequest,
  responseType: model_nodeRegistration_pb.GetNodeRegistrationResponse
};

exports.NodeRegistrationService = NodeRegistrationService;

function NodeRegistrationServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

NodeRegistrationServiceClient.prototype.getNodeRegistrations = function getNodeRegistrations(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(NodeRegistrationService.GetNodeRegistrations, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

NodeRegistrationServiceClient.prototype.getNodeRegistration = function getNodeRegistration(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(NodeRegistrationService.GetNodeRegistration, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.NodeRegistrationServiceClient = NodeRegistrationServiceClient;

