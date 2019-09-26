// package: model
// file: model/nodeRegistration.proto

import * as jspb from "google-protobuf";
import * as model_pagination_pb from "../model/pagination_pb";

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
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
  getQueued(): boolean;
  setQueued(value: boolean): void;

  getMinregistrationheight(): number;
  setMinregistrationheight(value: number): void;

  getMaxregistrationheight(): number;
  setMaxregistrationheight(value: number): void;

  hasPagination(): boolean;
  clearPagination(): void;
  getPagination(): model_pagination_pb.Pagination | undefined;
  setPagination(value?: model_pagination_pb.Pagination): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNodeRegistrationsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetNodeRegistrationsRequest): GetNodeRegistrationsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetNodeRegistrationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNodeRegistrationsRequest;
  static deserializeBinaryFromReader(message: GetNodeRegistrationsRequest, reader: jspb.BinaryReader): GetNodeRegistrationsRequest;
}

export namespace GetNodeRegistrationsRequest {
  export type AsObject = {
    queued: boolean,
    minregistrationheight: number,
    maxregistrationheight: number,
    pagination?: model_pagination_pb.Pagination.AsObject,
  }
}

export class GetNodeRegistrationsResponse extends jspb.Message {
  getTotal(): string;
  setTotal(value: string): void;

  clearNoderegistrationsList(): void;
  getNoderegistrationsList(): Array<NodeRegistration>;
  setNoderegistrationsList(value: Array<NodeRegistration>): void;
  addNoderegistrations(value?: NodeRegistration, index?: number): NodeRegistration;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNodeRegistrationsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetNodeRegistrationsResponse): GetNodeRegistrationsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetNodeRegistrationsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNodeRegistrationsResponse;
  static deserializeBinaryFromReader(message: GetNodeRegistrationsResponse, reader: jspb.BinaryReader): GetNodeRegistrationsResponse;
}

export namespace GetNodeRegistrationsResponse {
  export type AsObject = {
    total: string,
    noderegistrationsList: Array<NodeRegistration.AsObject>,
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
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

export class GetNodeRegistrationResponse extends jspb.Message {
  hasNoderegistration(): boolean;
  clearNoderegistration(): void;
  getNoderegistration(): NodeRegistration | undefined;
  setNoderegistration(value?: NodeRegistration): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNodeRegistrationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetNodeRegistrationResponse): GetNodeRegistrationResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetNodeRegistrationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNodeRegistrationResponse;
  static deserializeBinaryFromReader(message: GetNodeRegistrationResponse, reader: jspb.BinaryReader): GetNodeRegistrationResponse;
}

export namespace GetNodeRegistrationResponse {
  export type AsObject = {
    noderegistration?: NodeRegistration.AsObject,
  }
}

