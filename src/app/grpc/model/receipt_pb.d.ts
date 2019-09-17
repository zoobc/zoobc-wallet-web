// package: model
// file: model/receipt.proto

import * as jspb from "google-protobuf";

export class Receipt extends jspb.Message {
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

  getReceiptmerkleroot(): Uint8Array | string;
  getReceiptmerkleroot_asU8(): Uint8Array;
  getReceiptmerkleroot_asB64(): string;
  setReceiptmerkleroot(value: Uint8Array | string): void;

  getRecipientsignature(): Uint8Array | string;
  getRecipientsignature_asU8(): Uint8Array;
  getRecipientsignature_asB64(): string;
  setRecipientsignature(value: Uint8Array | string): void;

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
    senderpublickey: Uint8Array | string,
    recipientpublickey: Uint8Array | string,
    datumtype: number,
    datumhash: Uint8Array | string,
    referenceblockheight: number,
    referenceblockhash: Uint8Array | string,
    receiptmerkleroot: Uint8Array | string,
    recipientsignature: Uint8Array | string,
  }
}

