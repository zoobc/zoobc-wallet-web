// package: service
// file: service/accountBalance.proto

var service_accountBalance_pb = require("../service/accountBalance_pb");
var model_accountBalance_pb = require("../model/accountBalance_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var AccountBalanceService = (function () {
  function AccountBalanceService() {}
  AccountBalanceService.serviceName = "service.AccountBalanceService";
  return AccountBalanceService;
}());

AccountBalanceService.GetAccountBalances = {
  methodName: "GetAccountBalances",
  service: AccountBalanceService,
  requestStream: false,
  responseStream: false,
  requestType: model_accountBalance_pb.GetAccountBalancesRequest,
  responseType: model_accountBalance_pb.GetAccountBalancesResponse
};

AccountBalanceService.GetAccountBalance = {
  methodName: "GetAccountBalance",
  service: AccountBalanceService,
  requestStream: false,
  responseStream: false,
  requestType: model_accountBalance_pb.GetAccountBalanceRequest,
  responseType: model_accountBalance_pb.GetAccountBalanceResponse
};

exports.AccountBalanceService = AccountBalanceService;

function AccountBalanceServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

AccountBalanceServiceClient.prototype.getAccountBalances = function getAccountBalances(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccountBalanceService.GetAccountBalances, {
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

AccountBalanceServiceClient.prototype.getAccountBalance = function getAccountBalance(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccountBalanceService.GetAccountBalance, {
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

exports.AccountBalanceServiceClient = AccountBalanceServiceClient;

