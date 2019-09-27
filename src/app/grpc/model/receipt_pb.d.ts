// package: model
// file: model/receipt.proto

import * as jspb from "google-protobuf";
import * as model_batchReceipt_pb from "../model/batchReceipt_pb";

export class Receipt extends jspb.Message {
  hasBatchreceipt(): boolean;
  clearBatchreceipt(): void;
  getBatchreceipt(): model_batchReceipt_pb.BatchReceipt | undefined;
  setBatchreceipt(value?: model_batchReceipt_pb.BatchReceipt): void;

  getRmr(): Uint8Array | string;
  getRmr_asU8(): Uint8Array;
  getRmr_asB64(): string;
  setRmr(value: Uint8Array | string): void;

  getRmrindex(): number;
  setRmrindex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Receipt.AsObject;
  static toObject(includeInstance: boolean, msg: Receipt): Receipt.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Receipt, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Receipt;
  static deserializeBinaryFromReader(message: Receipt, reader: jspb.BinaryReader): Receipt;
}

export namespace Receipt {
  export type AsObject = {
    batchreceipt?: model_batchReceipt_pb.BatchReceipt.AsObject,
    rmr: Uint8Array | string,
    rmrindex: number,
  }
}

