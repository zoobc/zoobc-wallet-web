// package: service
// file: service/mempool.proto

var service_mempool_pb = require("../service/mempool_pb");
var model_mempool_pb = require("../model/mempool_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var MempoolService = (function () {
  function MempoolService() {}
  MempoolService.serviceName = "service.MempoolService";
  return MempoolService;
}());

MempoolService.GetMempoolTransactions = {
  methodName: "GetMempoolTransactions",
  service: MempoolService,
  requestStream: false,
  responseStream: false,
  requestType: model_mempool_pb.GetMempoolTransactionsRequest,
  responseType: model_mempool_pb.GetMempoolTransactionsResponse
};

MempoolService.GetMempoolTransaction = {
  methodName: "GetMempoolTransaction",
  service: MempoolService,
  requestStream: false,
  responseStream: false,
  requestType: model_mempool_pb.GetMempoolTransactionRequest,
  responseType: model_mempool_pb.GetMempoolTransactionResponse
};

exports.MempoolService = MempoolService;

function MempoolServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

MempoolServiceClient.prototype.getMempoolTransactions = function getMempoolTransactions(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MempoolService.GetMempoolTransactions, {
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

MempoolServiceClient.prototype.getMempoolTransaction = function getMempoolTransaction(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MempoolService.GetMempoolTransaction, {
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

exports.MempoolServiceClient = MempoolServiceClient;

