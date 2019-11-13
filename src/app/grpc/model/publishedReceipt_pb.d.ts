// package: model
// file: model/publishedReceipt.proto

import * as jspb from "google-protobuf";
import * as model_batchReceipt_pb from "../model/batchReceipt_pb";

export class PublishedReceipt extends jspb.Message {
  hasBatchreceipt(): boolean;
  clearBatchreceipt(): void;
  getBatchreceipt(): model_batchReceipt_pb.BatchReceipt | undefined;
  setBatchreceipt(value?: model_batchReceipt_pb.BatchReceipt): void;

  getIntermediatehashes(): Uint8Array | string;
  getIntermediatehashes_asU8(): Uint8Array;
  getIntermediatehashes_asB64(): string;
  setIntermediatehashes(value: Uint8Array | string): void;

  getBlockheight(): number;
  setBlockheight(value: number): void;

  getReceiptindex(): number;
  setReceiptindex(value: number): void;

  getPublishedindex(): number;
  setPublishedindex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PublishedReceipt.AsObject;
  static toObject(includeInstance: boolean, msg: PublishedReceipt): PublishedReceipt.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PublishedReceipt, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PublishedReceipt;
  static deserializeBinaryFromReader(message: PublishedReceipt, reader: jspb.BinaryReader): PublishedReceipt;
}

export namespace PublishedReceipt {
  export type AsObject = {
    batchreceipt?: model_batchReceipt_pb.BatchReceipt.AsObject,
    intermediatehashes: Uint8Array | string,
    blockheight: number,
    receiptindex: number,
    publishedindex: number,
  }
}

