// package: model
// file: model/blockchain.proto

import * as jspb from "google-protobuf";
import * as model_block_pb from "../model/block_pb";

export class ChainStatus extends jspb.Message {
  getChaintype(): number;
  setChaintype(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  hasLastblock(): boolean;
  clearLastblock(): void;
  getLastblock(): model_block_pb.Block | undefined;
  setLastblock(value?: model_block_pb.Block): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainStatus.AsObject;
  static toObject(includeInstance: boolean, msg: ChainStatus): ChainStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChainStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainStatus;
  static deserializeBinaryFromReader(message: ChainStatus, reader: jspb.BinaryReader): ChainStatus;
}

export namespace ChainStatus {
  export type AsObject = {
    chaintype: number,
    height: number,
    lastblock?: model_block_pb.Block.AsObject,
  }
}

export class GetCumulativeDifficultyResponse extends jspb.Message {
  getCumulativedifficulty(): string;
  setCumulativedifficulty(value: string): void;

  getHeight(): number;
  setHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCumulativeDifficultyResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCumulativeDifficultyResponse): GetCumulativeDifficultyResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCumulativeDifficultyResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCumulativeDifficultyResponse;
  static deserializeBinaryFromReader(message: GetCumulativeDifficultyResponse, reader: jspb.BinaryReader): GetCumulativeDifficultyResponse;
}

export namespace GetCumulativeDifficultyResponse {
  export type AsObject = {
    cumulativedifficulty: string,
    height: number,
  }
}

export class GetCumulativeDifficultyRequest extends jspb.Message {
  getChaintype(): number;
  setChaintype(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCumulativeDifficultyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCumulativeDifficultyRequest): GetCumulativeDifficultyRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCumulativeDifficultyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCumulativeDifficultyRequest;
  static deserializeBinaryFromReader(message: GetCumulativeDifficultyRequest, reader: jspb.BinaryReader): GetCumulativeDifficultyRequest;
}

export namespace GetCumulativeDifficultyRequest {
  export type AsObject = {
    chaintype: number,
  }
}

export class GetCommonMilestoneBlockIdsRequest extends jspb.Message {
  getChaintype(): number;
  setChaintype(value: number): void;

  getLastblockid(): string;
  setLastblockid(value: string): void;

  getLastmilestoneblockid(): string;
  setLastmilestoneblockid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCommonMilestoneBlockIdsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCommonMilestoneBlockIdsRequest): GetCommonMilestoneBlockIdsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCommonMilestoneBlockIdsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCommonMilestoneBlockIdsRequest;
  static deserializeBinaryFromReader(message: GetCommonMilestoneBlockIdsRequest, reader: jspb.BinaryReader): GetCommonMilestoneBlockIdsRequest;
}

export namespace GetCommonMilestoneBlockIdsRequest {
  export type AsObject = {
    chaintype: number,
    lastblockid: string,
    lastmilestoneblockid: string,
  }
}

export class GetCommonMilestoneBlockIdsResponse extends jspb.Message {
  clearBlockidsList(): void;
  getBlockidsList(): Array<string>;
  setBlockidsList(value: Array<string>): void;
  addBlockids(value: string, index?: number): string;

  getLast(): boolean;
  setLast(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCommonMilestoneBlockIdsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCommonMilestoneBlockIdsResponse): GetCommonMilestoneBlockIdsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCommonMilestoneBlockIdsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCommonMilestoneBlockIdsResponse;
  static deserializeBinaryFromReader(message: GetCommonMilestoneBlockIdsResponse, reader: jspb.BinaryReader): GetCommonMilestoneBlockIdsResponse;
}

export namespace GetCommonMilestoneBlockIdsResponse {
  export type AsObject = {
    blockidsList: Array<string>,
    last: boolean,
  }
}

