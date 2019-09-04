// package: service
// file: service/host.proto

var service_host_pb = require("../service/host_pb");
var model_empty_pb = require("../model/empty_pb");
var model_host_pb = require("../model/host_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var HostService = (function () {
  function HostService() {}
  HostService.serviceName = "service.HostService";
  return HostService;
}());

HostService.GetHostInfo = {
  methodName: "GetHostInfo",
  service: HostService,
  requestStream: false,
  responseStream: false,
  requestType: model_empty_pb.Empty,
  responseType: model_host_pb.HostInfo
};

HostService.GetHostPeers = {
  methodName: "GetHostPeers",
  service: HostService,
  requestStream: false,
  responseStream: false,
  requestType: model_empty_pb.Empty,
  responseType: model_host_pb.GetHostPeersResponse
};

exports.HostService = HostService;

function HostServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

HostServiceClient.prototype.getHostInfo = function getHostInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(HostService.GetHostInfo, {
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

HostServiceClient.prototype.getHostPeers = function getHostPeers(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(HostService.GetHostPeers, {
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

exports.HostServiceClient = HostServiceClient;

