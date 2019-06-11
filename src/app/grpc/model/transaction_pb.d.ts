import * as jspb from "google-protobuf"

export class Transaction extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getBlockid(): number;
  setBlockid(value: number): void;

  getDeadline(): number;
  setDeadline(value: number): void;

  getSenderpublickey(): Uint8Array | string;
  getSenderpublickey_asU8(): Uint8Array;
  getSenderpublickey_asB64(): string;
  setSenderpublickey(value: Uint8Array | string): void;

  getRecipientpublickey(): Uint8Array | string;
  getRecipientpublickey_asU8(): Uint8Array;
  getRecipientpublickey_asB64(): string;
  setRecipientpublickey(value: Uint8Array | string): void;

  getAmountnqt(): number;
  setAmountnqt(value: number): void;

  getFeenqt(): number;
  setFeenqt(value: number): void;

  getEcblockheight(): number;
  setEcblockheight(value: number): void;

  getEcblockid(): number;
  setEcblockid(value: number): void;

  getVersion(): Uint8Array | string;
  getVersion_asU8(): Uint8Array;
  getVersion_asB64(): string;
  setVersion(value: Uint8Array | string): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  getType(): Uint8Array | string;
  getType_asU8(): Uint8Array;
  getType_asB64(): string;
  setType(value: Uint8Array | string): void;

  getSubtype(): Uint8Array | string;
  getSubtype_asU8(): Uint8Array;
  getSubtype_asB64(): string;
  setSubtype(value: Uint8Array | string): void;

  getHeight(): number;
  setHeight(value: number): void;

  getHash(): string;
  setHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transaction.AsObject;
  static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    id: number,
    blockid: number,
    deadline: number,
    senderpublickey: Uint8Array | string,
    recipientpublickey: Uint8Array | string,
    amountnqt: number,
    feenqt: number,
    ecblockheight: number,
    ecblockid: number,
    version: Uint8Array | string,
    timestamp: number,
    signature: Uint8Array | string,
    type: Uint8Array | string,
    subtype: Uint8Array | string,
    height: number,
    hash: string,
  }
}

export class GetTransactionRequest extends jspb.Message {
  getTransactionbytes(): Uint8Array | string;
  getTransactionbytes_asU8(): Uint8Array;
  getTransactionbytes_asB64(): string;
  setTransactionbytes(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionRequest): GetTransactionRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionRequest;
  static deserializeBinaryFromReader(message: GetTransactionRequest, reader: jspb.BinaryReader): GetTransactionRequest;
}

export namespace GetTransactionRequest {
  export type AsObject = {
    transactionbytes: Uint8Array | string,
  }
}

export class GetTransactionResponse extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getIsvalid(): boolean;
  setIsvalid(value: boolean): void;

  getTransactionbytes(): Uint8Array | string;
  getTransactionbytes_asU8(): Uint8Array;
  getTransactionbytes_asB64(): string;
  setTransactionbytes(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionResponse): GetTransactionResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransactionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionResponse;
  static deserializeBinaryFromReader(message: GetTransactionResponse, reader: jspb.BinaryReader): GetTransactionResponse;
}

export namespace GetTransactionResponse {
  export type AsObject = {
    message: string,
    isvalid: boolean,
    transactionbytes: Uint8Array | string,
  }
}

export class GetTransactionsByAccountPublicKeyRequest extends jspb.Message {
  getAccountpublickey(): Uint8Array | string;
  getAccountpublickey_asU8(): Uint8Array;
  getAccountpublickey_asB64(): string;
  setAccountpublickey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsByAccountPublicKeyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsByAccountPublicKeyRequest): GetTransactionsByAccountPublicKeyRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransactionsByAccountPublicKeyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsByAccountPublicKeyRequest;
  static deserializeBinaryFromReader(message: GetTransactionsByAccountPublicKeyRequest, reader: jspb.BinaryReader): GetTransactionsByAccountPublicKeyRequest;
}

export namespace GetTransactionsByAccountPublicKeyRequest {
  export type AsObject = {
    accountpublickey: Uint8Array | string,
  }
}

export class GetTransactionsByBlockIDRequest extends jspb.Message {
  getBlockid(): number;
  setBlockid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsByBlockIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsByBlockIDRequest): GetTransactionsByBlockIDRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransactionsByBlockIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsByBlockIDRequest;
  static deserializeBinaryFromReader(message: GetTransactionsByBlockIDRequest, reader: jspb.BinaryReader): GetTransactionsByBlockIDRequest;
}

export namespace GetTransactionsByBlockIDRequest {
  export type AsObject = {
    blockid: number,
  }
}

export class GetTransactionsResponse extends jspb.Message {
  getTransactionsList(): Array<Transaction>;
  setTransactionsList(value: Array<Transaction>): void;
  clearTransactionsList(): void;
  addTransactions(value?: Transaction, index?: number): Transaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsResponse): GetTransactionsResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransactionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsResponse;
  static deserializeBinaryFromReader(message: GetTransactionsResponse, reader: jspb.BinaryReader): GetTransactionsResponse;
}

export namespace GetTransactionsResponse {
  export type AsObject = {
    transactionsList: Array<Transaction.AsObject>,
  }
}

