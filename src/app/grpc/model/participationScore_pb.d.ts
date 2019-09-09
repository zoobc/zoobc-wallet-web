// package: model
// file: model/participationScore.proto

import * as jspb from "google-protobuf";

export class ParticipationScore extends jspb.Message {
  getNodeid(): string;
  setNodeid(value: string): void;

  getScore(): string;
  setScore(value: string): void;

  getLatest(): boolean;
  setLatest(value: boolean): void;

  getHeight(): number;
  setHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParticipationScore.AsObject;
  static toObject(includeInstance: boolean, msg: ParticipationScore): ParticipationScore.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParticipationScore, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParticipationScore;
  static deserializeBinaryFromReader(message: ParticipationScore, reader: jspb.BinaryReader): ParticipationScore;
}

export namespace ParticipationScore {
  export type AsObject = {
    nodeid: string,
    score: string,
    latest: boolean,
    height: number,
  }
}

