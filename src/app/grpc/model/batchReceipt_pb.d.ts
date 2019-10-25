// package: model
// file: model/batchReceipt.proto

import * as jspb from "google-protobuf";

export class BatchReceipt extends jspb.Message {
  getSenderpublickey(): Uint8Array | string;
  getSenderpublickey_asU8(): Uint8Array;
  getSenderpublickey_asB64(): string;
  setSenderpublickey(value: Uint8Array | string): void;

  getRecipientpublickey(): Uint8Array | string;
  getRecipientpublickey_asU8(): Uint8Array;
  getRecipientpublickey_asB64(): string;
  setRecipientpublickey(value: Uint8Array | string): void;

  getDatumtype(): number;
  setDatumtype(value: number): void;

  getDatumhash(): Uint8Array | string;
  getDatumhash_asU8(): Uint8Array;
  getDatumhash_asB64(): string;
  setDatumhash(value: Uint8Array | string): void;

  getReferenceblockheight(): number;
  setReferenceblockheight(value: number): void;

  getReferenceblockhash(): Uint8Array | string;
  getReferenceblockhash_asU8(): Uint8Array;
  getReferenceblockhash_asB64(): string;
  setReferenceblockhash(value: Uint8Array | string): void;

  getRmrlinked(): Uint8Array | string;
  getRmrlinked_asU8(): Uint8Array;
  getRmrlinked_asB64(): string;
  setRmrlinked(value: Uint8Array | string): void;

  getRecipientsignature(): Uint8Array | string;
  getRecipientsignature_asU8(): Uint8Array;
  getRecipientsignature_asB64(): string;
  setRecipientsignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BatchReceipt.AsObject;
  static toObject(includeInstance: boolean, msg: BatchReceipt): BatchReceipt.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BatchReceipt, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BatchReceipt;
  static deserializeBinaryFromReader(message: BatchReceipt, reader: jspb.BinaryReader): BatchReceipt;
}

export namespace BatchReceipt {
  export type AsObject = {
    senderpublickey: Uint8Array | string,
    recipientpublickey: Uint8Array | string,
    datumtype: number,
    datumhash: Uint8Array | string,
    referenceblockheight: number,
    referenceblockhash: Uint8Array | string,
    rmrlinked: Uint8Array | string,
    recipientsignature: Uint8Array | string,
  }
}

