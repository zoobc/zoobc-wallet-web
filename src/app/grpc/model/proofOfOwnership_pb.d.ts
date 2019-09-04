// package: model
// file: model/proofOfOwnership.proto

import * as jspb from "google-protobuf";

export class ProofOfOwnership extends jspb.Message {
  getMessagebytes(): Uint8Array | string;
  getMessagebytes_asU8(): Uint8Array;
  getMessagebytes_asB64(): string;
  setMessagebytes(value: Uint8Array | string): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProofOfOwnership.AsObject;
  static toObject(includeInstance: boolean, msg: ProofOfOwnership): ProofOfOwnership.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProofOfOwnership, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProofOfOwnership;
  static deserializeBinaryFromReader(message: ProofOfOwnership, reader: jspb.BinaryReader): ProofOfOwnership;
}

export namespace ProofOfOwnership {
  export type AsObject = {
    messagebytes: Uint8Array | string,
    signature: Uint8Array | string,
  }
}

export class ProofOfOwnershipMessage extends jspb.Message {
  getAccountaddress(): string;
  setAccountaddress(value: string): void;

  getBlockhash(): Uint8Array | string;
  getBlockhash_asU8(): Uint8Array;
  getBlockhash_asB64(): string;
  setBlockhash(value: Uint8Array | string): void;

  getBlockheight(): number;
  setBlockheight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProofOfOwnershipMessage.AsObject;
  static toObject(includeInstance: boolean, msg: ProofOfOwnershipMessage): ProofOfOwnershipMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProofOfOwnershipMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProofOfOwnershipMessage;
  static deserializeBinaryFromReader(message: ProofOfOwnershipMessage, reader: jspb.BinaryReader): ProofOfOwnershipMessage;
}

export namespace ProofOfOwnershipMessage {
  export type AsObject = {
    accountaddress: string,
    blockhash: Uint8Array | string,
    blockheight: number,
  }
}

export class GetProofOfOwnershipRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProofOfOwnershipRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetProofOfOwnershipRequest): GetProofOfOwnershipRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetProofOfOwnershipRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProofOfOwnershipRequest;
  static deserializeBinaryFromReader(message: GetProofOfOwnershipRequest, reader: jspb.BinaryReader): GetProofOfOwnershipRequest;
}

export namespace GetProofOfOwnershipRequest {
  export type AsObject = {
  }
}

