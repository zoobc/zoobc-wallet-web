// package: service
// file: service/p2pCommunication.proto

var service_p2pCommunication_pb = require("../service/p2pCommunication_pb");
var model_peer_pb = require("../model/peer_pb");
var model_node_pb = require("../model/node_pb");
var model_empty_pb = require("../model/empty_pb");
var model_block_pb = require("../model/block_pb");
var model_blockchain_pb = require("../model/blockchain_pb");
var model_transaction_pb = require("../model/transaction_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var P2PCommunication = (function () {
  function P2PCommunication() {}
  P2PCommunication.serviceName = "service.P2PCommunication";
  return P2PCommunication;
}());

P2PCommunication.GetPeerInfo = {
  methodName: "GetPeerInfo",
  service: P2PCommunication,
  requestStream: false,
  responseStream: false,
  requestType: model_peer_pb.GetPeerInfoRequest,
  responseType: model_node_pb.Node
};

P2PCommunication.GetMorePeers = {
  methodName: "GetMorePeers",
  service: P2PCommunication,
  requestStream: false,
  responseStream: false,
  requestType: model_empty_pb.Empty,
  responseType: model_peer_pb.GetMorePeersResponse
};

P2PCommunication.SendPeers = {
  methodName: "SendPeers",
  service: P2PCommunication,
  requestStream: false,
  responseStream: false,
  requestType: model_peer_pb.SendPeersRequest,
  responseType: model_empty_pb.Empty
};

P2PCommunication.SendBlock = {
  methodName: "SendBlock",
  service: P2PCommunication,
  requestStream: false,
  responseStream: false,
  requestType: model_block_pb.SendBlockRequest,
  responseType: model_block_pb.SendBlockResponse
};

P2PCommunication.SendTransaction = {
  methodName: "SendTransaction",
  service: P2PCommunication,
  requestStream: false,
  responseStream: false,
  requestType: model_transaction_pb.SendTransactionRequest,
  responseType: model_transaction_pb.SendTransactionResponse
};

P2PCommunication.GetCumulativeDifficulty = {
  methodName: "GetCumulativeDifficulty",
  service: P2PCommunication,
  requestStream: false,
  responseStream: false,
  requestType: model_blockchain_pb.GetCumulativeDifficultyRequest,
  responseType: model_blockchain_pb.GetCumulativeDifficultyResponse
};

P2PCommunication.GetCommonMilestoneBlockIDs = {
  methodName: "GetCommonMilestoneBlockIDs",
  service: P2PCommunication,
  requestStream: false,
  responseStream: false,
  requestType: model_blockchain_pb.GetCommonMilestoneBlockIdsRequest,
  responseType: model_blockchain_pb.GetCommonMilestoneBlockIdsResponse
};

P2PCommunication.GetNextBlockIDs = {
  methodName: "GetNextBlockIDs",
  service: P2PCommunication,
  requestStream: false,
  responseStream: false,
  requestType: model_block_pb.GetNextBlockIdsRequest,
  responseType: model_block_pb.BlockIdsResponse
};

P2PCommunication.GetNextBlocks = {
  methodName: "GetNextBlocks",
  service: P2PCommunication,
  requestStream: false,
  responseStream: false,
  requestType: model_block_pb.GetNextBlocksRequest,
  responseType: model_block_pb.BlocksData
};

exports.P2PCommunication = P2PCommunication;

function P2PCommunicationClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

P2PCommunicationClient.prototype.getPeerInfo = function getPeerInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(P2PCommunication.GetPeerInfo, {
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

P2PCommunicationClient.prototype.getMorePeers = function getMorePeers(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(P2PCommunication.GetMorePeers, {
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

P2PCommunicationClient.prototype.sendPeers = function sendPeers(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(P2PCommunication.SendPeers, {
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

P2PCommunicationClient.prototype.sendBlock = function sendBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(P2PCommunication.SendBlock, {
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

P2PCommunicationClient.prototype.sendTransaction = function sendTransaction(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(P2PCommunication.SendTransaction, {
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

P2PCommunicationClient.prototype.getCumulativeDifficulty = function getCumulativeDifficulty(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(P2PCommunication.GetCumulativeDifficulty, {
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

P2PCommunicationClient.prototype.getCommonMilestoneBlockIDs = function getCommonMilestoneBlockIDs(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(P2PCommunication.GetCommonMilestoneBlockIDs, {
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

P2PCommunicationClient.prototype.getNextBlockIDs = function getNextBlockIDs(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(P2PCommunication.GetNextBlockIDs, {
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

P2PCommunicationClient.prototype.getNextBlocks = function getNextBlocks(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(P2PCommunication.GetNextBlocks, {
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

exports.P2PCommunicationClient = P2PCommunicationClient;

