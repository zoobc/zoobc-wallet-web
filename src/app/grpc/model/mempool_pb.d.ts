import * as jspb from "google-protobuf"

export class MempoolTransaction extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getFeeperbyte(): number;
  setFeeperbyte(value: number): void;

  getArrivaltimestamp(): string;
  setArrivaltimestamp(value: string): void;

  getTransactionbytes(): Uint8Array | string;
  getTransactionbytes_asU8(): Uint8Array;
  getTransactionbytes_asB64(): string;
  setTransactionbytes(value: Uint8Array | string): void;

  getSenderaccountaddress(): string;
  setSenderaccountaddress(value: string): void;

  getRecipientaccountaddress(): string;
  setRecipientaccountaddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MempoolTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: MempoolTransaction): MempoolTransaction.AsObject;
  static serializeBinaryToWriter(message: MempoolTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MempoolTransaction;
  static deserializeBinaryFromReader(message: MempoolTransaction, reader: jspb.BinaryReader): MempoolTransaction;
}

export namespace MempoolTransaction {
  export type AsObject = {
    id: string,
    feeperbyte: number,
    arrivaltimestamp: string,
    transactionbytes: Uint8Array | string,
    senderaccountaddress: string,
    recipientaccountaddress: string,
  }
}

export class GetMempoolTransactionRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMempoolTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMempoolTransactionRequest): GetMempoolTransactionRequest.AsObject;
  static serializeBinaryToWriter(message: GetMempoolTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMempoolTransactionRequest;
  static deserializeBinaryFromReader(message: GetMempoolTransactionRequest, reader: jspb.BinaryReader): GetMempoolTransactionRequest;
}

export namespace GetMempoolTransactionRequest {
  export type AsObject = {
    id: string,
  }
}

export class GetMempoolTransactionResponse extends jspb.Message {
  getTransaction(): MempoolTransaction | undefined;
  setTransaction(value?: MempoolTransaction): void;
  hasTransaction(): boolean;
  clearTransaction(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMempoolTransactionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMempoolTransactionResponse): GetMempoolTransactionResponse.AsObject;
  static serializeBinaryToWriter(message: GetMempoolTransactionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMempoolTransactionResponse;
  static deserializeBinaryFromReader(message: GetMempoolTransactionResponse, reader: jspb.BinaryReader): GetMempoolTransactionResponse;
}

export namespace GetMempoolTransactionResponse {
  export type AsObject = {
    transaction?: MempoolTransaction.AsObject,
  }
}

export class GetMempoolTransactionsRequest extends jspb.Message {
  getTimestampstart(): string;
  setTimestampstart(value: string): void;

  getTimestampend(): string;
  setTimestampend(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getLimit(): number;
  setLimit(value: number): void;

  getPage(): number;
  setPage(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMempoolTransactionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMempoolTransactionsRequest): GetMempoolTransactionsRequest.AsObject;
  static serializeBinaryToWriter(message: GetMempoolTransactionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMempoolTransactionsRequest;
  static deserializeBinaryFromReader(message: GetMempoolTransactionsRequest, reader: jspb.BinaryReader): GetMempoolTransactionsRequest;
}

export namespace GetMempoolTransactionsRequest {
  export type AsObject = {
    timestampstart: string,
    timestampend: string,
    address: string,
    limit: number,
    page: number,
  }
}

export class GetMempoolTransactionsResponse extends jspb.Message {
  getTotal(): number;
  setTotal(value: number): void;

  getMempooltransactionsList(): Array<MempoolTransaction>;
  setMempooltransactionsList(value: Array<MempoolTransaction>): void;
  clearMempooltransactionsList(): void;
  addMempooltransactions(value?: MempoolTransaction, index?: number): MempoolTransaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMempoolTransactionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMempoolTransactionsResponse): GetMempoolTransactionsResponse.AsObject;
  static serializeBinaryToWriter(message: GetMempoolTransactionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMempoolTransactionsResponse;
  static deserializeBinaryFromReader(message: GetMempoolTransactionsResponse, reader: jspb.BinaryReader): GetMempoolTransactionsResponse;
}

export namespace GetMempoolTransactionsResponse {
  export type AsObject = {
    total: number,
    mempooltransactionsList: Array<MempoolTransaction.AsObject>,
  }
}

