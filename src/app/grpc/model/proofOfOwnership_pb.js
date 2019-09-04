/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.model.GetProofOfOwnershipRequest', null, global);
goog.exportSymbol('proto.model.ProofOfOwnership', null, global);
goog.exportSymbol('proto.model.ProofOfOwnershipMessage', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.model.ProofOfOwnership = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.model.ProofOfOwnership, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.model.ProofOfOwnership.displayName = 'proto.model.ProofOfOwnership';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.model.ProofOfOwnershipMessage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.model.ProofOfOwnershipMessage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.model.ProofOfOwnershipMessage.displayName = 'proto.model.ProofOfOwnershipMessage';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.model.GetProofOfOwnershipRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.model.GetProofOfOwnershipRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.model.GetProofOfOwnershipRequest.displayName = 'proto.model.GetProofOfOwnershipRequest';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.model.ProofOfOwnership.prototype.toObject = function(opt_includeInstance) {
  return proto.model.ProofOfOwnership.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.model.ProofOfOwnership} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.model.ProofOfOwnership.toObject = function(includeInstance, msg) {
  var f, obj = {
    messagebytes: msg.getMessagebytes_asB64(),
    signature: msg.getSignature_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.model.ProofOfOwnership}
 */
proto.model.ProofOfOwnership.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.model.ProofOfOwnership;
  return proto.model.ProofOfOwnership.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.model.ProofOfOwnership} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.model.ProofOfOwnership}
 */
proto.model.ProofOfOwnership.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setMessagebytes(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSignature(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.model.ProofOfOwnership.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.model.ProofOfOwnership.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.model.ProofOfOwnership} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.model.ProofOfOwnership.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMessagebytes_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getSignature_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
};


/**
 * optional bytes MessageBytes = 1;
 * @return {!(string|Uint8Array)}
 */
proto.model.ProofOfOwnership.prototype.getMessagebytes = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes MessageBytes = 1;
 * This is a type-conversion wrapper around `getMessagebytes()`
 * @return {string}
 */
proto.model.ProofOfOwnership.prototype.getMessagebytes_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getMessagebytes()));
};


/**
 * optional bytes MessageBytes = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getMessagebytes()`
 * @return {!Uint8Array}
 */
proto.model.ProofOfOwnership.prototype.getMessagebytes_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getMessagebytes()));
};


/** @param {!(string|Uint8Array)} value */
proto.model.ProofOfOwnership.prototype.setMessagebytes = function(value) {
  jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional bytes Signature = 2;
 * @return {!(string|Uint8Array)}
 */
proto.model.ProofOfOwnership.prototype.getSignature = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes Signature = 2;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.model.ProofOfOwnership.prototype.getSignature_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSignature()));
};


/**
 * optional bytes Signature = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.model.ProofOfOwnership.prototype.getSignature_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSignature()));
};


/** @param {!(string|Uint8Array)} value */
proto.model.ProofOfOwnership.prototype.setSignature = function(value) {
  jspb.Message.setProto3BytesField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.model.ProofOfOwnershipMessage.prototype.toObject = function(opt_includeInstance) {
  return proto.model.ProofOfOwnershipMessage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.model.ProofOfOwnershipMessage} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.model.ProofOfOwnershipMessage.toObject = function(includeInstance, msg) {
  var f, obj = {
    accountaddress: jspb.Message.getFieldWithDefault(msg, 1, ""),
    blockhash: msg.getBlockhash_asB64(),
    blockheight: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.model.ProofOfOwnershipMessage}
 */
proto.model.ProofOfOwnershipMessage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.model.ProofOfOwnershipMessage;
  return proto.model.ProofOfOwnershipMessage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.model.ProofOfOwnershipMessage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.model.ProofOfOwnershipMessage}
 */
proto.model.ProofOfOwnershipMessage.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAccountaddress(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlockhash(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setBlockheight(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.model.ProofOfOwnershipMessage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.model.ProofOfOwnershipMessage.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.model.ProofOfOwnershipMessage} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.model.ProofOfOwnershipMessage.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAccountaddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getBlockhash_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getBlockheight();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
};


/**
 * optional string AccountAddress = 1;
 * @return {string}
 */
proto.model.ProofOfOwnershipMessage.prototype.getAccountaddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.model.ProofOfOwnershipMessage.prototype.setAccountaddress = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bytes BlockHash = 2;
 * @return {!(string|Uint8Array)}
 */
proto.model.ProofOfOwnershipMessage.prototype.getBlockhash = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes BlockHash = 2;
 * This is a type-conversion wrapper around `getBlockhash()`
 * @return {string}
 */
proto.model.ProofOfOwnershipMessage.prototype.getBlockhash_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlockhash()));
};


/**
 * optional bytes BlockHash = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockhash()`
 * @return {!Uint8Array}
 */
proto.model.ProofOfOwnershipMessage.prototype.getBlockhash_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlockhash()));
};


/** @param {!(string|Uint8Array)} value */
proto.model.ProofOfOwnershipMessage.prototype.setBlockhash = function(value) {
  jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional uint32 BlockHeight = 3;
 * @return {number}
 */
proto.model.ProofOfOwnershipMessage.prototype.getBlockheight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.model.ProofOfOwnershipMessage.prototype.setBlockheight = function(value) {
  jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.model.GetProofOfOwnershipRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.model.GetProofOfOwnershipRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.model.GetProofOfOwnershipRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.model.GetProofOfOwnershipRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.model.GetProofOfOwnershipRequest}
 */
proto.model.GetProofOfOwnershipRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.model.GetProofOfOwnershipRequest;
  return proto.model.GetProofOfOwnershipRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.model.GetProofOfOwnershipRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.model.GetProofOfOwnershipRequest}
 */
proto.model.GetProofOfOwnershipRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.model.GetProofOfOwnershipRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.model.GetProofOfOwnershipRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.model.GetProofOfOwnershipRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.model.GetProofOfOwnershipRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


goog.object.extend(exports, proto.model);
