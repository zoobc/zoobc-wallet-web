import * as jspb from "google-protobuf"

export class AccountDataset extends jspb.Message {
  getSetteraccountaddress(): string;
  setSetteraccountaddress(value: string): void;

  getRecipientaccountaddress(): string;
  setRecipientaccountaddress(value: string): void;

  getProperty(): string;
  setProperty(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  getTimestampstarts(): number;
  setTimestampstarts(value: number): void;

  getTimestampexpires(): number;
  setTimestampexpires(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  getLatest(): boolean;
  setLatest(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountDataset.AsObject;
  static toObject(includeInstance: boolean, msg: AccountDataset): AccountDataset.AsObject;
  static serializeBinaryToWriter(message: AccountDataset, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountDataset;
  static deserializeBinaryFromReader(message: AccountDataset, reader: jspb.BinaryReader): AccountDataset;
}

export namespace AccountDataset {
  export type AsObject = {
    setteraccountaddress: string,
    recipientaccountaddress: string,
    property: string,
    value: string,
    timestampstarts: number,
    timestampexpires: number,
    height: number,
    latest: boolean,
  }
}

