// package: service
// file: service/transaction.proto

var service_transaction_pb = require("../service/transaction_pb");
var model_transaction_pb = require("../model/transaction_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TransactionService = (function () {
  function TransactionService() {}
  TransactionService.serviceName = "service.TransactionService";
  return TransactionService;
}());

TransactionService.GetTransactions = {
  methodName: "GetTransactions",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: model_transaction_pb.GetTransactionsRequest,
  responseType: model_transaction_pb.GetTransactionsResponse
};

TransactionService.GetTransaction = {
  methodName: "GetTransaction",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: model_transaction_pb.GetTransactionRequest,
  responseType: model_transaction_pb.Transaction
};

TransactionService.PostTransaction = {
  methodName: "PostTransaction",
  service: TransactionService,
  requestStream: false,
  responseStream: false,
  requestType: model_transaction_pb.PostTransactionRequest,
  responseType: model_transaction_pb.PostTransactionResponse
};

exports.TransactionService = TransactionService;

function TransactionServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TransactionServiceClient.prototype.getTransactions = function getTransactions(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.GetTransactions, {
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

TransactionServiceClient.prototype.getTransaction = function getTransaction(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.GetTransaction, {
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

TransactionServiceClient.prototype.postTransaction = function postTransaction(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TransactionService.PostTransaction, {
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

exports.TransactionServiceClient = TransactionServiceClient;

