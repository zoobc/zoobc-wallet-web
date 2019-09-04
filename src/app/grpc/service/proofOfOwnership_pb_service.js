// package: service
// file: service/proofOfOwnership.proto

var service_proofOfOwnership_pb = require("../service/proofOfOwnership_pb");
var model_proofOfOwnership_pb = require("../model/proofOfOwnership_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var NodeAdminService = (function () {
  function NodeAdminService() {}
  NodeAdminService.serviceName = "service.NodeAdminService";
  return NodeAdminService;
}());

NodeAdminService.GetProofOfOwnership = {
  methodName: "GetProofOfOwnership",
  service: NodeAdminService,
  requestStream: false,
  responseStream: false,
  requestType: model_proofOfOwnership_pb.GetProofOfOwnershipRequest,
  responseType: model_proofOfOwnership_pb.ProofOfOwnership
};

exports.NodeAdminService = NodeAdminService;

function NodeAdminServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

NodeAdminServiceClient.prototype.getProofOfOwnership = function getProofOfOwnership(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(NodeAdminService.GetProofOfOwnership, {
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

exports.NodeAdminServiceClient = NodeAdminServiceClient;

