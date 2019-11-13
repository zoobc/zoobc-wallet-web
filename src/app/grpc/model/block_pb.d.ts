// package: model
// file: model/block.proto

import * as jspb from "google-protobuf";
import * as model_transaction_pb from "../model/transaction_pb";
import * as model_batchReceipt_pb from "../model/batchReceipt_pb";
import * as model_publishedReceipt_pb from "../model/publishedReceipt_pb";
import * as model_skippedBlocksmith_pb from "../model/skippedBlocksmith_pb";

export class Block extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getBlockhash(): Uint8Array | string;
  getBlockhash_asU8(): Uint8Array;
  getBlockhash_asB64(): string;
  setBlockhash(value: Uint8Array | string): void;

  getPreviousblockhash(): Uint8Array | string;
  getPreviousblockhash_asU8(): Uint8Array;
  getPreviousblockhash_asB64(): string;
  setPreviousblockhash(value: Uint8Array | string): void;

  getHeight(): number;
  setHeight(value: number): void;

  getTimestamp(): string;
  setTimestamp(value: string): void;

  getBlockseed(): Uint8Array | string;
  getBlockseed_asU8(): Uint8Array;
  getBlockseed_asB64(): string;
  setBlockseed(value: Uint8Array | string): void;

  getBlocksignature(): Uint8Array | string;
  getBlocksignature_asU8(): Uint8Array;
  getBlocksignature_asB64(): string;
  setBlocksignature(value: Uint8Array | string): void;

  getCumulativedifficulty(): string;
  setCumulativedifficulty(value: string): void;

  getSmithscale(): string;
  setSmithscale(value: string): void;

  getBlocksmithpublickey(): Uint8Array | string;
  getBlocksmithpublickey_asU8(): Uint8Array;
  getBlocksmithpublickey_asB64(): string;
  setBlocksmithpublickey(value: Uint8Array | string): void;

  getTotalamount(): string;
  setTotalamount(value: string): void;

  getTotalfee(): string;
  setTotalfee(value: string): void;

  getTotalcoinbase(): string;
  setTotalcoinbase(value: string): void;

  getVersion(): number;
  setVersion(value: number): void;

  getPayloadlength(): number;
  setPayloadlength(value: number): void;

  getPayloadhash(): Uint8Array | string;
  getPayloadhash_asU8(): Uint8Array;
  getPayloadhash_asB64(): string;
  setPayloadhash(value: Uint8Array | string): void;

  clearTransactionsList(): void;
  getTransactionsList(): Array<model_transaction_pb.Transaction>;
  setTransactionsList(value: Array<model_transaction_pb.Transaction>): void;
  addTransactions(value?: model_transaction_pb.Transaction, index?: number): model_transaction_pb.Transaction;

  clearPublishedreceiptsList(): void;
  getPublishedreceiptsList(): Array<model_publishedReceipt_pb.PublishedReceipt>;
  setPublishedreceiptsList(value: Array<model_publishedReceipt_pb.PublishedReceipt>): void;
  addPublishedreceipts(value?: model_publishedReceipt_pb.PublishedReceipt, index?: number): model_publishedReceipt_pb.PublishedReceipt;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Block.AsObject;
  static toObject(includeInstance: boolean, msg: Block): Block.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Block, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Block;
  static deserializeBinaryFromReader(message: Block, reader: jspb.BinaryReader): Block;
}

export namespace Block {
  export type AsObject = {
    id: string,
    blockhash: Uint8Array | string,
    previousblockhash: Uint8Array | string,
    height: number,
    timestamp: string,
    blockseed: Uint8Array | string,
    blocksignature: Uint8Array | string,
    cumulativedifficulty: string,
    smithscale: string,
    blocksmithpublickey: Uint8Array | string,
    totalamount: string,
    totalfee: string,
    totalcoinbase: string,
    version: number,
    payloadlength: number,
    payloadhash: Uint8Array | string,
    transactionsList: Array<model_transaction_pb.Transaction.AsObject>,
    publishedreceiptsList: Array<model_publishedReceipt_pb.PublishedReceipt.AsObject>,
  }
}

export class BlockExtendedInfo extends jspb.Message {
  hasBlock(): boolean;
  clearBlock(): void;
  getBlock(): Block | undefined;
  setBlock(value?: Block): void;

  getTotalreceipts(): string;
  setTotalreceipts(value: string): void;

  getReceiptvalue(): string;
  setReceiptvalue(value: string): void;

  getBlocksmithaccountaddress(): string;
  setBlocksmithaccountaddress(value: string): void;

  getPopchange(): string;
  setPopchange(value: string): void;

  clearSkippedblocksmithsList(): void;
  getSkippedblocksmithsList(): Array<model_skippedBlocksmith_pb.SkippedBlocksmith>;
  setSkippedblocksmithsList(value: Array<model_skippedBlocksmith_pb.SkippedBlocksmith>): void;
  addSkippedblocksmiths(value?: model_skippedBlocksmith_pb.SkippedBlocksmith, index?: number): model_skippedBlocksmith_pb.SkippedBlocksmith;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockExtendedInfo.AsObject;
  static toObject(includeInstance: boolean, msg: BlockExtendedInfo): BlockExtendedInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockExtendedInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockExtendedInfo;
  static deserializeBinaryFromReader(message: BlockExtendedInfo, reader: jspb.BinaryReader): BlockExtendedInfo;
}

export namespace BlockExtendedInfo {
  export type AsObject = {
    block?: Block.AsObject,
    totalreceipts: string,
    receiptvalue: string,
    blocksmithaccountaddress: string,
    popchange: string,
    skippedblocksmithsList: Array<model_skippedBlocksmith_pb.SkippedBlocksmith.AsObject>,
  }
}

export class GetBlockRequest extends jspb.Message {
  getChaintype(): number;
  setChaintype(value: number): void;

  getId(): string;
  setId(value: string): void;

  getHeight(): number;
  setHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlockRequest): GetBlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlockRequest;
  static deserializeBinaryFromReader(message: GetBlockRequest, reader: jspb.BinaryReader): GetBlockRequest;
}

export namespace GetBlockRequest {
  export type AsObject = {
    chaintype: number,
    id: string,
    height: number,
  }
}

export class GetBlocksRequest extends jspb.Message {
  getChaintype(): number;
  setChaintype(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlocksRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlocksRequest): GetBlocksRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlocksRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlocksRequest;
  static deserializeBinaryFromReader(message: GetBlocksRequest, reader: jspb.BinaryReader): GetBlocksRequest;
}

export namespace GetBlocksRequest {
  export type AsObject = {
    chaintype: number,
    limit: number,
    height: number,
  }
}

export class GetBlocksResponse extends jspb.Message {
  getChaintype(): number;
  setChaintype(value: number): void;

  getCount(): number;
  setCount(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  clearBlocksList(): void;
  getBlocksList(): Array<BlockExtendedInfo>;
  setBlocksList(value: Array<BlockExtendedInfo>): void;
  addBlocks(value?: BlockExtendedInfo, index?: number): BlockExtendedInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlocksResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlocksResponse): GetBlocksResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlocksResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlocksResponse;
  static deserializeBinaryFromReader(message: GetBlocksResponse, reader: jspb.BinaryReader): GetBlocksResponse;
}

export namespace GetBlocksResponse {
  export type AsObject = {
    chaintype: number,
    count: number,
    height: number,
    blocksList: Array<BlockExtendedInfo.AsObject>,
  }
}

export class GetNextBlockIdsRequest extends jspb.Message {
  getChaintype(): number;
  setChaintype(value: number): void;

  getBlockid(): string;
  setBlockid(value: string): void;

  getLimit(): number;
  setLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNextBlockIdsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetNextBlockIdsRequest): GetNextBlockIdsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetNextBlockIdsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNextBlockIdsRequest;
  static deserializeBinaryFromReader(message: GetNextBlockIdsRequest, reader: jspb.BinaryReader): GetNextBlockIdsRequest;
}

export namespace GetNextBlockIdsRequest {
  export type AsObject = {
    chaintype: number,
    blockid: string,
    limit: number,
  }
}

export class BlockIdsResponse extends jspb.Message {
  clearBlockidsList(): void;
  getBlockidsList(): Array<string>;
  setBlockidsList(value: Array<string>): void;
  addBlockids(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockIdsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: BlockIdsResponse): BlockIdsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockIdsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockIdsResponse;
  static deserializeBinaryFromReader(message: BlockIdsResponse, reader: jspb.BinaryReader): BlockIdsResponse;
}

export namespace BlockIdsResponse {
  export type AsObject = {
    blockidsList: Array<string>,
  }
}

export class GetNextBlocksRequest extends jspb.Message {
  getChaintype(): number;
  setChaintype(value: number): void;

  getBlockid(): string;
  setBlockid(value: string): void;

  clearBlockidsList(): void;
  getBlockidsList(): Array<string>;
  setBlockidsList(value: Array<string>): void;
  addBlockids(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNextBlocksRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetNextBlocksRequest): GetNextBlocksRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetNextBlocksRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNextBlocksRequest;
  static deserializeBinaryFromReader(message: GetNextBlocksRequest, reader: jspb.BinaryReader): GetNextBlocksRequest;
}

export namespace GetNextBlocksRequest {
  export type AsObject = {
    chaintype: number,
    blockid: string,
    blockidsList: Array<string>,
  }
}

export class BlocksData extends jspb.Message {
  clearNextblocksList(): void;
  getNextblocksList(): Array<Block>;
  setNextblocksList(value: Array<Block>): void;
  addNextblocks(value?: Block, index?: number): Block;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlocksData.AsObject;
  static toObject(includeInstance: boolean, msg: BlocksData): BlocksData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlocksData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlocksData;
  static deserializeBinaryFromReader(message: BlocksData, reader: jspb.BinaryReader): BlocksData;
}

export namespace BlocksData {
  export type AsObject = {
    nextblocksList: Array<Block.AsObject>,
  }
}

export class SendBlockRequest extends jspb.Message {
  hasBlock(): boolean;
  clearBlock(): void;
  getBlock(): Block | undefined;
  setBlock(value?: Block): void;

  getChaintype(): number;
  setChaintype(value: number): void;

  getSenderpublickey(): Uint8Array | string;
  getSenderpublickey_asU8(): Uint8Array;
  getSenderpublickey_asB64(): string;
  setSenderpublickey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendBlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendBlockRequest): SendBlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SendBlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendBlockRequest;
  static deserializeBinaryFromReader(message: SendBlockRequest, reader: jspb.BinaryReader): SendBlockRequest;
}

export namespace SendBlockRequest {
  export type AsObject = {
    block?: Block.AsObject,
    chaintype: number,
    senderpublickey: Uint8Array | string,
  }
}

export class SendBlockResponse extends jspb.Message {
  hasBatchreceipt(): boolean;
  clearBatchreceipt(): void;
  getBatchreceipt(): model_batchReceipt_pb.BatchReceipt | undefined;
  setBatchreceipt(value?: model_batchReceipt_pb.BatchReceipt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendBlockResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SendBlockResponse): SendBlockResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SendBlockResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendBlockResponse;
  static deserializeBinaryFromReader(message: SendBlockResponse, reader: jspb.BinaryReader): SendBlockResponse;
}

export namespace SendBlockResponse {
  export type AsObject = {
    batchreceipt?: model_batchReceipt_pb.BatchReceipt.AsObject,
  }
}

