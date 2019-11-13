// package: model
// file: model/skippedBlocksmith.proto

import * as jspb from "google-protobuf";

export class SkippedBlocksmith extends jspb.Message {
  getBlocksmithpublickey(): Uint8Array | string;
  getBlocksmithpublickey_asU8(): Uint8Array;
  getBlocksmithpublickey_asB64(): string;
  setBlocksmithpublickey(value: Uint8Array | string): void;

  getPopchange(): string;
  setPopchange(value: string): void;

  getBlockheight(): number;
  setBlockheight(value: number): void;

  getBlocksmithindex(): number;
  setBlocksmithindex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SkippedBlocksmith.AsObject;
  static toObject(includeInstance: boolean, msg: SkippedBlocksmith): SkippedBlocksmith.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SkippedBlocksmith, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SkippedBlocksmith;
  static deserializeBinaryFromReader(message: SkippedBlocksmith, reader: jspb.BinaryReader): SkippedBlocksmith;
}

export namespace SkippedBlocksmith {
  export type AsObject = {
    blocksmithpublickey: Uint8Array | string,
    popchange: string,
    blockheight: number,
    blocksmithindex: number,
  }
}

