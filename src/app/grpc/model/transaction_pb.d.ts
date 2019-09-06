// package: model
// file: model/transaction.proto

import * as jspb from "google-protobuf";
import * as model_proofOfOwnership_pb from "../model/proofOfOwnership_pb";
import * as model_pagination_pb from "../model/pagination_pb";

export class Transaction extends jspb.Message {
  getVersion(): number;
  setVersion(value: number): void;

  getId(): string;
  setId(value: string): void;

  getBlockid(): string;
  setBlockid(value: string): void;

  getHeight(): number;
  setHeight(value: number): void;

  getSenderaccountaddress(): string;
  setSenderaccountaddress(value: string): void;

  getRecipientaccountaddress(): string;
  setRecipientaccountaddress(value: string): void;

  getTransactiontype(): number;
  setTransactiontype(value: number): void;

  getFee(): string;
  setFee(value: string): void;

  getTimestamp(): string;
  setTimestamp(value: string): void;

  getTransactionhash(): Uint8Array | string;
  getTransactionhash_asU8(): Uint8Array;
  getTransactionhash_asB64(): string;
  setTransactionhash(value: Uint8Array | string): void;

  getTransactionbodylength(): number;
  setTransactionbodylength(value: number): void;

  getTransactionbodybytes(): Uint8Array | string;
  getTransactionbodybytes_asU8(): Uint8Array;
  getTransactionbodybytes_asB64(): string;
  setTransactionbodybytes(value: Uint8Array | string): void;

  getTransactionindex(): number;
  setTransactionindex(value: number): void;

  hasEmptytransactionbody(): boolean;
  clearEmptytransactionbody(): void;
  getEmptytransactionbody(): EmptyTransactionBody | undefined;
  setEmptytransactionbody(value?: EmptyTransactionBody): void;

  hasSendmoneytransactionbody(): boolean;
  clearSendmoneytransactionbody(): void;
  getSendmoneytransactionbody(): SendMoneyTransactionBody | undefined;
  setSendmoneytransactionbody(value?: SendMoneyTransactionBody): void;

  hasNoderegistrationtransactionbody(): boolean;
  clearNoderegistrationtransactionbody(): void;
  getNoderegistrationtransactionbody(): NodeRegistrationTransactionBody | undefined;
  setNoderegistrationtransactionbody(value?: NodeRegistrationTransactionBody): void;

  hasUpdatenoderegistrationtransactionbody(): boolean;
  clearUpdatenoderegistrationtransactionbody(): void;
  getUpdatenoderegistrationtransactionbody(): UpdateNodeRegistrationTransactionBody | undefined;
  setUpdatenoderegistrationtransactionbody(value?: UpdateNodeRegistrationTransactionBody): void;

  hasRemovenoderegistrationtransactionbody(): boolean;
  clearRemovenoderegistrationtransactionbody(): void;
  getRemovenoderegistrationtransactionbody(): RemoveNodeRegistrationTransactionBody | undefined;
  setRemovenoderegistrationtransactionbody(value?: RemoveNodeRegistrationTransactionBody): void;

  hasClaimnoderegistrationtransactionbody(): boolean;
  clearClaimnoderegistrationtransactionbody(): void;
  getClaimnoderegistrationtransactionbody(): ClaimNodeRegistrationTransactionBody | undefined;
  setClaimnoderegistrationtransactionbody(value?: ClaimNodeRegistrationTransactionBody): void;

  hasSetupaccountdatasettransactionbody(): boolean;
  clearSetupaccountdatasettransactionbody(): void;
  getSetupaccountdatasettransactionbody(): SetupAccountDatasetTransactionBody | undefined;
  setSetupaccountdatasettransactionbody(value?: SetupAccountDatasetTransactionBody): void;

  hasRemoveaccountdatasettransactionbody(): boolean;
  clearRemoveaccountdatasettransactionbody(): void;
  getRemoveaccountdatasettransactionbody(): RemoveAccountDatasetTransactionBody | undefined;
  setRemoveaccountdatasettransactionbody(value?: RemoveAccountDatasetTransactionBody): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  getTransactionbodyCase(): Transaction.TransactionbodyCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transaction.AsObject;
  static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    version: number,
    id: string,
    blockid: string,
    height: number,
    senderaccountaddress: string,
    recipientaccountaddress: string,
    transactiontype: number,
    fee: string,
    timestamp: string,
    transactionhash: Uint8Array | string,
    transactionbodylength: number,
    transactionbodybytes: Uint8Array | string,
    transactionindex: number,
    emptytransactionbody?: EmptyTransactionBody.AsObject,
    sendmoneytransactionbody?: SendMoneyTransactionBody.AsObject,
    noderegistrationtransactionbody?: NodeRegistrationTransactionBody.AsObject,
    updatenoderegistrationtransactionbody?: UpdateNodeRegistrationTransactionBody.AsObject,
    removenoderegistrationtransactionbody?: RemoveNodeRegistrationTransactionBody.AsObject,
    claimnoderegistrationtransactionbody?: ClaimNodeRegistrationTransactionBody.AsObject,
    setupaccountdatasettransactionbody?: SetupAccountDatasetTransactionBody.AsObject,
    removeaccountdatasettransactionbody?: RemoveAccountDatasetTransactionBody.AsObject,
    signature: Uint8Array | string,
  }

  export enum TransactionbodyCase {
    TRANSACTIONBODY_NOT_SET = 0,
    EMPTYTRANSACTIONBODY = 14,
    SENDMONEYTRANSACTIONBODY = 15,
    NODEREGISTRATIONTRANSACTIONBODY = 16,
    UPDATENODEREGISTRATIONTRANSACTIONBODY = 17,
    REMOVENODEREGISTRATIONTRANSACTIONBODY = 18,
    CLAIMNODEREGISTRATIONTRANSACTIONBODY = 19,
    SETUPACCOUNTDATASETTRANSACTIONBODY = 20,
    REMOVEACCOUNTDATASETTRANSACTIONBODY = 21,
  }
}

export class EmptyTransactionBody extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmptyTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: EmptyTransactionBody): EmptyTransactionBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EmptyTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EmptyTransactionBody;
  static deserializeBinaryFromReader(message: EmptyTransactionBody, reader: jspb.BinaryReader): EmptyTransactionBody;
}

export namespace EmptyTransactionBody {
  export type AsObject = {
  }
}

export class SendMoneyTransactionBody extends jspb.Message {
  getAmount(): string;
  setAmount(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendMoneyTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: SendMoneyTransactionBody): SendMoneyTransactionBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SendMoneyTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendMoneyTransactionBody;
  static deserializeBinaryFromReader(message: SendMoneyTransactionBody, reader: jspb.BinaryReader): SendMoneyTransactionBody;
}

export namespace SendMoneyTransactionBody {
  export type AsObject = {
    amount: string,
  }
}

export class NodeRegistrationTransactionBody extends jspb.Message {
  getNodepublickey(): Uint8Array | string;
  getNodepublickey_asU8(): Uint8Array;
  getNodepublickey_asB64(): string;
  setNodepublickey(value: Uint8Array | string): void;

  getAccountaddress(): string;
  setAccountaddress(value: string): void;

  getNodeaddress(): string;
  setNodeaddress(value: string): void;

  getLockedbalance(): string;
  setLockedbalance(value: string): void;

  hasPoown(): boolean;
  clearPoown(): void;
  getPoown(): model_proofOfOwnership_pb.ProofOfOwnership | undefined;
  setPoown(value?: model_proofOfOwnership_pb.ProofOfOwnership): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeRegistrationTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: NodeRegistrationTransactionBody): NodeRegistrationTransactionBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NodeRegistrationTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeRegistrationTransactionBody;
  static deserializeBinaryFromReader(message: NodeRegistrationTransactionBody, reader: jspb.BinaryReader): NodeRegistrationTransactionBody;
}

export namespace NodeRegistrationTransactionBody {
  export type AsObject = {
    nodepublickey: Uint8Array | string,
    accountaddress: string,
    nodeaddress: string,
    lockedbalance: string,
    poown?: model_proofOfOwnership_pb.ProofOfOwnership.AsObject,
  }
}

export class UpdateNodeRegistrationTransactionBody extends jspb.Message {
  getNodepublickey(): Uint8Array | string;
  getNodepublickey_asU8(): Uint8Array;
  getNodepublickey_asB64(): string;
  setNodepublickey(value: Uint8Array | string): void;

  getNodeaddress(): string;
  setNodeaddress(value: string): void;

  getLockedbalance(): string;
  setLockedbalance(value: string): void;

  hasPoown(): boolean;
  clearPoown(): void;
  getPoown(): model_proofOfOwnership_pb.ProofOfOwnership | undefined;
  setPoown(value?: model_proofOfOwnership_pb.ProofOfOwnership): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateNodeRegistrationTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateNodeRegistrationTransactionBody): UpdateNodeRegistrationTransactionBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateNodeRegistrationTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateNodeRegistrationTransactionBody;
  static deserializeBinaryFromReader(message: UpdateNodeRegistrationTransactionBody, reader: jspb.BinaryReader): UpdateNodeRegistrationTransactionBody;
}

export namespace UpdateNodeRegistrationTransactionBody {
  export type AsObject = {
    nodepublickey: Uint8Array | string,
    nodeaddress: string,
    lockedbalance: string,
    poown?: model_proofOfOwnership_pb.ProofOfOwnership.AsObject,
  }
}

export class RemoveNodeRegistrationTransactionBody extends jspb.Message {
  getNodepublickey(): Uint8Array | string;
  getNodepublickey_asU8(): Uint8Array;
  getNodepublickey_asB64(): string;
  setNodepublickey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveNodeRegistrationTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveNodeRegistrationTransactionBody): RemoveNodeRegistrationTransactionBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveNodeRegistrationTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveNodeRegistrationTransactionBody;
  static deserializeBinaryFromReader(message: RemoveNodeRegistrationTransactionBody, reader: jspb.BinaryReader): RemoveNodeRegistrationTransactionBody;
}

export namespace RemoveNodeRegistrationTransactionBody {
  export type AsObject = {
    nodepublickey: Uint8Array | string,
  }
}

export class SetupAccountDatasetTransactionBody extends jspb.Message {
  getSetteraccountaddress(): string;
  setSetteraccountaddress(value: string): void;

  getRecipientaccountaddress(): string;
  setRecipientaccountaddress(value: string): void;

  getProperty(): string;
  setProperty(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  getMuchtime(): string;
  setMuchtime(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetupAccountDatasetTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: SetupAccountDatasetTransactionBody): SetupAccountDatasetTransactionBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetupAccountDatasetTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetupAccountDatasetTransactionBody;
  static deserializeBinaryFromReader(message: SetupAccountDatasetTransactionBody, reader: jspb.BinaryReader): SetupAccountDatasetTransactionBody;
}

export namespace SetupAccountDatasetTransactionBody {
  export type AsObject = {
    setteraccountaddress: string,
    recipientaccountaddress: string,
    property: string,
    value: string,
    muchtime: string,
  }
}

export class RemoveAccountDatasetTransactionBody extends jspb.Message {
  getSetteraccountaddress(): string;
  setSetteraccountaddress(value: string): void;

  getRecipientaccountaddress(): string;
  setRecipientaccountaddress(value: string): void;

  getProperty(): string;
  setProperty(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveAccountDatasetTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveAccountDatasetTransactionBody): RemoveAccountDatasetTransactionBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveAccountDatasetTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveAccountDatasetTransactionBody;
  static deserializeBinaryFromReader(message: RemoveAccountDatasetTransactionBody, reader: jspb.BinaryReader): RemoveAccountDatasetTransactionBody;
}

export namespace RemoveAccountDatasetTransactionBody {
  export type AsObject = {
    setteraccountaddress: string,
    recipientaccountaddress: string,
    property: string,
    value: string,
  }
}

export class ClaimNodeRegistrationTransactionBody extends jspb.Message {
  getNodepublickey(): Uint8Array | string;
  getNodepublickey_asU8(): Uint8Array;
  getNodepublickey_asB64(): string;
  setNodepublickey(value: Uint8Array | string): void;

  getAccountaddress(): string;
  setAccountaddress(value: string): void;

  hasPoown(): boolean;
  clearPoown(): void;
  getPoown(): model_proofOfOwnership_pb.ProofOfOwnership | undefined;
  setPoown(value?: model_proofOfOwnership_pb.ProofOfOwnership): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimNodeRegistrationTransactionBody.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimNodeRegistrationTransactionBody): ClaimNodeRegistrationTransactionBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClaimNodeRegistrationTransactionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimNodeRegistrationTransactionBody;
  static deserializeBinaryFromReader(message: ClaimNodeRegistrationTransactionBody, reader: jspb.BinaryReader): ClaimNodeRegistrationTransactionBody;
}

export namespace ClaimNodeRegistrationTransactionBody {
  export type AsObject = {
    nodepublickey: Uint8Array | string,
    accountaddress: string,
    poown?: model_proofOfOwnership_pb.ProofOfOwnership.AsObject,
  }
}

export class GetTransactionRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionRequest): GetTransactionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionRequest;
  static deserializeBinaryFromReader(message: GetTransactionRequest, reader: jspb.BinaryReader): GetTransactionRequest;
}

export namespace GetTransactionRequest {
  export type AsObject = {
    id: string,
  }
}

export class GetTransactionsRequest extends jspb.Message {
  getAccountaddress(): string;
  setAccountaddress(value: string): void;

  getTimestampstart(): string;
  setTimestampstart(value: string): void;

  getTimestampend(): string;
  setTimestampend(value: string): void;

  getTransactiontype(): number;
  setTransactiontype(value: number): void;

  hasPagination(): boolean;
  clearPagination(): void;
  getPagination(): model_pagination_pb.Pagination | undefined;
  setPagination(value?: model_pagination_pb.Pagination): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsRequest): GetTransactionsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTransactionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsRequest;
  static deserializeBinaryFromReader(message: GetTransactionsRequest, reader: jspb.BinaryReader): GetTransactionsRequest;
}

export namespace GetTransactionsRequest {
  export type AsObject = {
    accountaddress: string,
    timestampstart: string,
    timestampend: string,
    transactiontype: number,
    pagination?: model_pagination_pb.Pagination.AsObject,
  }
}

export class GetTransactionsResponse extends jspb.Message {
  getTotal(): string;
  setTotal(value: string): void;

  clearTransactionsList(): void;
  getTransactionsList(): Array<Transaction>;
  setTransactionsList(value: Array<Transaction>): void;
  addTransactions(value?: Transaction, index?: number): Transaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsResponse): GetTransactionsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTransactionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsResponse;
  static deserializeBinaryFromReader(message: GetTransactionsResponse, reader: jspb.BinaryReader): GetTransactionsResponse;
}

export namespace GetTransactionsResponse {
  export type AsObject = {
    total: string,
    transactionsList: Array<Transaction.AsObject>,
  }
}

export class PostTransactionRequest extends jspb.Message {
  getTransactionbytes(): Uint8Array | string;
  getTransactionbytes_asU8(): Uint8Array;
  getTransactionbytes_asB64(): string;
  setTransactionbytes(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PostTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PostTransactionRequest): PostTransactionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PostTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PostTransactionRequest;
  static deserializeBinaryFromReader(message: PostTransactionRequest, reader: jspb.BinaryReader): PostTransactionRequest;
}

export namespace PostTransactionRequest {
  export type AsObject = {
    transactionbytes: Uint8Array | string,
  }
}

export class PostTransactionResponse extends jspb.Message {
  hasTransaction(): boolean;
  clearTransaction(): void;
  getTransaction(): Transaction | undefined;
  setTransaction(value?: Transaction): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PostTransactionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PostTransactionResponse): PostTransactionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PostTransactionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PostTransactionResponse;
  static deserializeBinaryFromReader(message: PostTransactionResponse, reader: jspb.BinaryReader): PostTransactionResponse;
}

export namespace PostTransactionResponse {
  export type AsObject = {
    transaction?: Transaction.AsObject,
  }
}

export class SendTransactionRequest extends jspb.Message {
  getTransactionbytes(): Uint8Array | string;
  getTransactionbytes_asU8(): Uint8Array;
  getTransactionbytes_asB64(): string;
  setTransactionbytes(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendTransactionRequest): SendTransactionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SendTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendTransactionRequest;
  static deserializeBinaryFromReader(message: SendTransactionRequest, reader: jspb.BinaryReader): SendTransactionRequest;
}

export namespace SendTransactionRequest {
  export type AsObject = {
    transactionbytes: Uint8Array | string,
  }
}

