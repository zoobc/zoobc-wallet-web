// package: service
// file: service/block.proto

var service_block_pb = require("../service/block_pb");
var model_block_pb = require("../model/block_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var BlockService = (function () {
  function BlockService() {}
  BlockService.serviceName = "service.BlockService";
  return BlockService;
}());

BlockService.GetBlocks = {
  methodName: "GetBlocks",
  service: BlockService,
  requestStream: false,
  responseStream: false,
  requestType: model_block_pb.GetBlocksRequest,
  responseType: model_block_pb.GetBlocksResponse
};

BlockService.GetBlock = {
  methodName: "GetBlock",
  service: BlockService,
  requestStream: false,
  responseStream: false,
  requestType: model_block_pb.GetBlockRequest,
  responseType: model_block_pb.BlockExtendedInfo
};

exports.BlockService = BlockService;

function BlockServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

BlockServiceClient.prototype.getBlocks = function getBlocks(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(BlockService.GetBlocks, {
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

BlockServiceClient.prototype.getBlock = function getBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(BlockService.GetBlock, {
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

exports.BlockServiceClient = BlockServiceClient;

