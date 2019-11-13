// package: model
// file: model/node.proto

import * as jspb from "google-protobuf";

export class Node extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getSharedaddress(): string;
  setSharedaddress(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getPort(): number;
  setPort(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Node.AsObject;
  static toObject(includeInstance: boolean, msg: Node): Node.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Node, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Node;
  static deserializeBinaryFromReader(message: Node, reader: jspb.BinaryReader): Node;
}

export namespace Node {
  export type AsObject = {
    id: number,
    sharedaddress: string,
    address: string,
    port: number,
  }
}

export class NodeKey extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getPublickey(): Uint8Array | string;
  getPublickey_asU8(): Uint8Array;
  getPublickey_asB64(): string;
  setPublickey(value: Uint8Array | string): void;

  getSeed(): string;
  setSeed(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeKey.AsObject;
  static toObject(includeInstance: boolean, msg: NodeKey): NodeKey.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NodeKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeKey;
  static deserializeBinaryFromReader(message: NodeKey, reader: jspb.BinaryReader): NodeKey;
}

export namespace NodeKey {
  export type AsObject = {
    id: number,
    publickey: Uint8Array | string,
    seed: string,
  }
}

export class GenerateNodeKeyRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenerateNodeKeyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GenerateNodeKeyRequest): GenerateNodeKeyRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GenerateNodeKeyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenerateNodeKeyRequest;
  static deserializeBinaryFromReader(message: GenerateNodeKeyRequest, reader: jspb.BinaryReader): GenerateNodeKeyRequest;
}

export namespace GenerateNodeKeyRequest {
  export type AsObject = {
  }
}

export class GenerateNodeKeyResponse extends jspb.Message {
  getNodepublickey(): Uint8Array | string;
  getNodepublickey_asU8(): Uint8Array;
  getNodepublickey_asB64(): string;
  setNodepublickey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenerateNodeKeyResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GenerateNodeKeyResponse): GenerateNodeKeyResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GenerateNodeKeyResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenerateNodeKeyResponse;
  static deserializeBinaryFromReader(message: GenerateNodeKeyResponse, reader: jspb.BinaryReader): GenerateNodeKeyResponse;
}

export namespace GenerateNodeKeyResponse {
  export type AsObject = {
    nodepublickey: Uint8Array | string,
  }
}

