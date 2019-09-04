// package: model
// file: model/pagination.proto

import * as jspb from "google-protobuf";

export class Pagination extends jspb.Message {
  getOrderfield(): string;
  setOrderfield(value: string): void;

  getOrderby(): OrderByMap[keyof OrderByMap];
  setOrderby(value: OrderByMap[keyof OrderByMap]): void;

  getPage(): number;
  setPage(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Pagination.AsObject;
  static toObject(includeInstance: boolean, msg: Pagination): Pagination.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Pagination, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Pagination;
  static deserializeBinaryFromReader(message: Pagination, reader: jspb.BinaryReader): Pagination;
}

export namespace Pagination {
  export type AsObject = {
    orderfield: string,
    orderby: OrderByMap[keyof OrderByMap],
    page: number,
    limit: number,
  }
}

export interface OrderByMap {
  DESC: 0;
  ASC: 1;
}

export const OrderBy: OrderByMap;

