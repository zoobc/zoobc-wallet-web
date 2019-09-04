// package: service
// file: service/nodeHardware.proto

var service_nodeHardware_pb = require("../service/nodeHardware_pb");
var model_nodeHardware_pb = require("../model/nodeHardware_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var NodeHardwareService = (function () {
  function NodeHardwareService() {}
  NodeHardwareService.serviceName = "service.NodeHardwareService";
  return NodeHardwareService;
}());

NodeHardwareService.GetNodeHardware = {
  methodName: "GetNodeHardware",
  service: NodeHardwareService,
  requestStream: true,
  responseStream: true,
  requestType: model_nodeHardware_pb.GetNodeHardwareRequest,
  responseType: model_nodeHardware_pb.GetNodeHardwareResponse
};

exports.NodeHardwareService = NodeHardwareService;

function NodeHardwareServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

NodeHardwareServiceClient.prototype.getNodeHardware = function getNodeHardware(metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.client(NodeHardwareService.GetNodeHardware, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  client.onMessage(function (message) {
    listeners.data.forEach(function (handler) {
      handler(message);
    })
  });
  client.start(metadata);
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.NodeHardwareServiceClient = NodeHardwareServiceClient;

