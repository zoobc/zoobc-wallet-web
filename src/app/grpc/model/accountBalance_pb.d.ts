// package: model
// file: model/accountBalance.proto

import * as jspb from "google-protobuf";

export class AccountBalance extends jspb.Message {
  getAccountaddress(): string;
  setAccountaddress(value: string): void;

  getBlockheight(): number;
  setBlockheight(value: number): void;

  getSpendablebalance(): string;
  setSpendablebalance(value: string): void;

  getBalance(): string;
  setBalance(value: string): void;

  getPoprevenue(): string;
  setPoprevenue(value: string): void;

  getLatest(): boolean;
  setLatest(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountBalance.AsObject;
  static toObject(includeInstance: boolean, msg: AccountBalance): AccountBalance.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AccountBalance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountBalance;
  static deserializeBinaryFromReader(message: AccountBalance, reader: jspb.BinaryReader): AccountBalance;
}

export namespace AccountBalance {
  export type AsObject = {
    accountaddress: string,
    blockheight: number,
    spendablebalance: string,
    balance: string,
    poprevenue: string,
    latest: boolean,
  }
}

export class GetAccountBalanceRequest extends jspb.Message {
  getAccountaddress(): string;
  setAccountaddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountBalanceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountBalanceRequest): GetAccountBalanceRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountBalanceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountBalanceRequest;
  static deserializeBinaryFromReader(message: GetAccountBalanceRequest, reader: jspb.BinaryReader): GetAccountBalanceRequest;
}

export namespace GetAccountBalanceRequest {
  export type AsObject = {
    accountaddress: string,
  }
}

export class GetAccountBalanceResponse extends jspb.Message {
  hasAccountbalance(): boolean;
  clearAccountbalance(): void;
  getAccountbalance(): AccountBalance | undefined;
  setAccountbalance(value?: AccountBalance): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountBalanceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountBalanceResponse): GetAccountBalanceResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountBalanceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountBalanceResponse;
  static deserializeBinaryFromReader(message: GetAccountBalanceResponse, reader: jspb.BinaryReader): GetAccountBalanceResponse;
}

export namespace GetAccountBalanceResponse {
  export type AsObject = {
    accountbalance?: AccountBalance.AsObject,
  }
}

export class GetAccountBalancesRequest extends jspb.Message {
  getBalancelowerthan(): number;
  setBalancelowerthan(value: number): void;

  getBalancehigherthan(): number;
  setBalancehigherthan(value: number): void;

  getSpendablebalancelowerthan(): number;
  setSpendablebalancelowerthan(value: number): void;

  getSpendablebalancehigherthan(): number;
  setSpendablebalancehigherthan(value: number): void;

  getPoprevenuebalancelowerthan(): number;
  setPoprevenuebalancelowerthan(value: number): void;

  getPoprevenuebalancehigherthan(): number;
  setPoprevenuebalancehigherthan(value: number): void;

  getBlockheight(): number;
  setBlockheight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountBalancesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountBalancesRequest): GetAccountBalancesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountBalancesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountBalancesRequest;
  static deserializeBinaryFromReader(message: GetAccountBalancesRequest, reader: jspb.BinaryReader): GetAccountBalancesRequest;
}

export namespace GetAccountBalancesRequest {
  export type AsObject = {
    balancelowerthan: number,
    balancehigherthan: number,
    spendablebalancelowerthan: number,
    spendablebalancehigherthan: number,
    poprevenuebalancelowerthan: number,
    poprevenuebalancehigherthan: number,
    blockheight: number,
  }
}

export class GetAccountBalancesResponse extends jspb.Message {
  getAccountbalancesize(): number;
  setAccountbalancesize(value: number): void;

  clearAccountbalanceList(): void;
  getAccountbalanceList(): Array<AccountBalance>;
  setAccountbalanceList(value: Array<AccountBalance>): void;
  addAccountbalance(value?: AccountBalance, index?: number): AccountBalance;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountBalancesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountBalancesResponse): GetAccountBalancesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountBalancesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountBalancesResponse;
  static deserializeBinaryFromReader(message: GetAccountBalancesResponse, reader: jspb.BinaryReader): GetAccountBalancesResponse;
}

export namespace GetAccountBalancesResponse {
  export type AsObject = {
    accountbalancesize: number,
    accountbalanceList: Array<AccountBalance.AsObject>,
  }
}

