import * as jspb from "google-protobuf"

export class NodeRegistration extends jspb.Message {
  getNodeid(): string;
  setNodeid(value: string): void;

  getNodepublickey(): Uint8Array | string;
  getNodepublickey_asU8(): Uint8Array;
  getNodepublickey_asB64(): string;
  setNodepublickey(value: Uint8Array | string): void;

  getAccountaddress(): string;
  setAccountaddress(value: string): void;

  getRegistrationheight(): number;
  setRegistrationheight(value: number): void;

  getNodeaddress(): string;
  setNodeaddress(value: string): void;

  getLockedbalance(): string;
  setLockedbalance(value: string): void;

  getQueued(): boolean;
  setQueued(value: boolean): void;

  getLatest(): boolean;
  setLatest(value: boolean): void;

  getHeight(): number;
  setHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeRegistration.AsObject;
  static toObject(includeInstance: boolean, msg: NodeRegistration): NodeRegistration.AsObject;
  static serializeBinaryToWriter(message: NodeRegistration, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeRegistration;
  static deserializeBinaryFromReader(message: NodeRegistration, reader: jspb.BinaryReader): NodeRegistration;
}

export namespace NodeRegistration {
  export type AsObject = {
    nodeid: string,
    nodepublickey: Uint8Array | string,
    accountaddress: string,
    registrationheight: number,
    nodeaddress: string,
    lockedbalance: string,
    queued: boolean,
    latest: boolean,
    height: number,
  }
}

export class GetNodeRegistrationsRequest extends jspb.Message {
  getNodepublickey(): Uint8Array | string;
  getNodepublickey_asU8(): Uint8Array;
  getNodepublickey_asB64(): string;
  setNodepublickey(value: Uint8Array | string): void;

  getAccountaddress(): string;
  setAccountaddress(value: string): void;

  getRegistrationheight(): number;
  setRegistrationheight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNodeRegistrationsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetNodeRegistrationsRequest): GetNodeRegistrationsRequest.AsObject;
  static serializeBinaryToWriter(message: GetNodeRegistrationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNodeRegistrationsRequest;
  static deserializeBinaryFromReader(message: GetNodeRegistrationsRequest, reader: jspb.BinaryReader): GetNodeRegistrationsRequest;
}

export namespace GetNodeRegistrationsRequest {
  export type AsObject = {
    nodepublickey: Uint8Array | string,
    accountaddress: string,
    registrationheight: number,
  }
}

export class GetNodeRegistrationRequest extends jspb.Message {
  getNodepublickey(): Uint8Array | string;
  getNodepublickey_asU8(): Uint8Array;
  getNodepublickey_asB64(): string;
  setNodepublickey(value: Uint8Array | string): void;

  getAccountaddress(): string;
  setAccountaddress(value: string): void;

  getRegistrationheight(): number;
  setRegistrationheight(value: number): void;

  getNodeaddress(): string;
  setNodeaddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNodeRegistrationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetNodeRegistrationRequest): GetNodeRegistrationRequest.AsObject;
  static serializeBinaryToWriter(message: GetNodeRegistrationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNodeRegistrationRequest;
  static deserializeBinaryFromReader(message: GetNodeRegistrationRequest, reader: jspb.BinaryReader): GetNodeRegistrationRequest;
}

export namespace GetNodeRegistrationRequest {
  export type AsObject = {
    nodepublickey: Uint8Array | string,
    accountaddress: string,
    registrationheight: number,
    nodeaddress: string,
  }
}

export class GetNodeRegistrationsResponse extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

  getNodepublickey(): Uint8Array | string;
  getNodepublickey_asU8(): Uint8Array;
  getNodepublickey_asB64(): string;
  setNodepublickey(value: Uint8Array | string): void;

  getAccountaddress(): string;
  setAccountaddress(value: string): void;

  getRegistrationheight(): number;
  setRegistrationheight(value: number): void;

  getNodeaddress(): string;
  setNodeaddress(value: string): void;

  getLockedbalance(): string;
  setLockedbalance(value: string): void;

  getQueued(): boolean;
  setQueued(value: boolean): void;

  getLatest(): boolean;
  setLatest(value: boolean): void;

  getHeight(): number;
  setHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNodeRegistrationsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetNodeRegistrationsResponse): GetNodeRegistrationsResponse.AsObject;
  static serializeBinaryToWriter(message: GetNodeRegistrationsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNodeRegistrationsResponse;
  static deserializeBinaryFromReader(message: GetNodeRegistrationsResponse, reader: jspb.BinaryReader): GetNodeRegistrationsResponse;
}

export namespace GetNodeRegistrationsResponse {
  export type AsObject = {
    id: Uint8Array | string,
    nodepublickey: Uint8Array | string,
    accountaddress: string,
    registrationheight: number,
    nodeaddress: string,
    lockedbalance: string,
    queued: boolean,
    latest: boolean,
    height: number,
  }
}

