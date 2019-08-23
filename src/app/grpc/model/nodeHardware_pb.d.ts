import * as jspb from "google-protobuf"

export class GetNodeHardwareResponse extends jspb.Message {
  getNodehardware(): NodeHardware | undefined;
  setNodehardware(value?: NodeHardware): void;
  hasNodehardware(): boolean;
  clearNodehardware(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNodeHardwareResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetNodeHardwareResponse): GetNodeHardwareResponse.AsObject;
  static serializeBinaryToWriter(message: GetNodeHardwareResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNodeHardwareResponse;
  static deserializeBinaryFromReader(message: GetNodeHardwareResponse, reader: jspb.BinaryReader): GetNodeHardwareResponse;
}

export namespace GetNodeHardwareResponse {
  export type AsObject = {
    nodehardware?: NodeHardware.AsObject,
  }
}

export class GetNodeHardwareRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNodeHardwareRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetNodeHardwareRequest): GetNodeHardwareRequest.AsObject;
  static serializeBinaryToWriter(message: GetNodeHardwareRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNodeHardwareRequest;
  static deserializeBinaryFromReader(message: GetNodeHardwareRequest, reader: jspb.BinaryReader): GetNodeHardwareRequest;
}

export namespace GetNodeHardwareRequest {
  export type AsObject = {
  }
}

export class NodeHardware extends jspb.Message {
  getCpuinformationList(): Array<CPUInformation>;
  setCpuinformationList(value: Array<CPUInformation>): void;
  clearCpuinformationList(): void;
  addCpuinformation(value?: CPUInformation, index?: number): CPUInformation;

  getMemoryinformation(): MemoryInformation | undefined;
  setMemoryinformation(value?: MemoryInformation): void;
  hasMemoryinformation(): boolean;
  clearMemoryinformation(): void;

  getStorageinformation(): StorageInformation | undefined;
  setStorageinformation(value?: StorageInformation): void;
  hasStorageinformation(): boolean;
  clearStorageinformation(): void;

  getHostinformation(): HostInformation | undefined;
  setHostinformation(value?: HostInformation): void;
  hasHostinformation(): boolean;
  clearHostinformation(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeHardware.AsObject;
  static toObject(includeInstance: boolean, msg: NodeHardware): NodeHardware.AsObject;
  static serializeBinaryToWriter(message: NodeHardware, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeHardware;
  static deserializeBinaryFromReader(message: NodeHardware, reader: jspb.BinaryReader): NodeHardware;
}

export namespace NodeHardware {
  export type AsObject = {
    cpuinformationList: Array<CPUInformation.AsObject>,
    memoryinformation?: MemoryInformation.AsObject,
    storageinformation?: StorageInformation.AsObject,
    hostinformation?: HostInformation.AsObject,
  }
}

export class CPUInformation extends jspb.Message {
  getFamily(): string;
  setFamily(value: string): void;

  getCpuindex(): number;
  setCpuindex(value: number): void;

  getModel(): string;
  setModel(value: string): void;

  getModelname(): string;
  setModelname(value: string): void;

  getVendorid(): string;
  setVendorid(value: string): void;

  getMhz(): number;
  setMhz(value: number): void;

  getCachesize(): number;
  setCachesize(value: number): void;

  getUsedpercent(): number;
  setUsedpercent(value: number): void;

  getCoreid(): string;
  setCoreid(value: string): void;

  getCores(): number;
  setCores(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CPUInformation.AsObject;
  static toObject(includeInstance: boolean, msg: CPUInformation): CPUInformation.AsObject;
  static serializeBinaryToWriter(message: CPUInformation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CPUInformation;
  static deserializeBinaryFromReader(message: CPUInformation, reader: jspb.BinaryReader): CPUInformation;
}

export namespace CPUInformation {
  export type AsObject = {
    family: string,
    cpuindex: number,
    model: string,
    modelname: string,
    vendorid: string,
    mhz: number,
    cachesize: number,
    usedpercent: number,
    coreid: string,
    cores: number,
  }
}

export class HostInformation extends jspb.Message {
  getUptime(): number;
  setUptime(value: number): void;

  getOs(): string;
  setOs(value: string): void;

  getPlatform(): string;
  setPlatform(value: string): void;

  getPlatformfamily(): string;
  setPlatformfamily(value: string): void;

  getPlatformversion(): string;
  setPlatformversion(value: string): void;

  getNumberofrunningprocess(): number;
  setNumberofrunningprocess(value: number): void;

  getHostid(): string;
  setHostid(value: string): void;

  getHostname(): string;
  setHostname(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HostInformation.AsObject;
  static toObject(includeInstance: boolean, msg: HostInformation): HostInformation.AsObject;
  static serializeBinaryToWriter(message: HostInformation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HostInformation;
  static deserializeBinaryFromReader(message: HostInformation, reader: jspb.BinaryReader): HostInformation;
}

export namespace HostInformation {
  export type AsObject = {
    uptime: number,
    os: string,
    platform: string,
    platformfamily: string,
    platformversion: string,
    numberofrunningprocess: number,
    hostid: string,
    hostname: string,
  }
}

export class MemoryInformation extends jspb.Message {
  getTotal(): number;
  setTotal(value: number): void;

  getFree(): number;
  setFree(value: number): void;

  getAvailable(): number;
  setAvailable(value: number): void;

  getUsed(): number;
  setUsed(value: number): void;

  getUsedpercent(): number;
  setUsedpercent(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MemoryInformation.AsObject;
  static toObject(includeInstance: boolean, msg: MemoryInformation): MemoryInformation.AsObject;
  static serializeBinaryToWriter(message: MemoryInformation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MemoryInformation;
  static deserializeBinaryFromReader(message: MemoryInformation, reader: jspb.BinaryReader): MemoryInformation;
}

export namespace MemoryInformation {
  export type AsObject = {
    total: number,
    free: number,
    available: number,
    used: number,
    usedpercent: number,
  }
}

export class StorageInformation extends jspb.Message {
  getFstype(): string;
  setFstype(value: string): void;

  getTotal(): number;
  setTotal(value: number): void;

  getFree(): number;
  setFree(value: number): void;

  getUsed(): number;
  setUsed(value: number): void;

  getUsedpercent(): number;
  setUsedpercent(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StorageInformation.AsObject;
  static toObject(includeInstance: boolean, msg: StorageInformation): StorageInformation.AsObject;
  static serializeBinaryToWriter(message: StorageInformation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StorageInformation;
  static deserializeBinaryFromReader(message: StorageInformation, reader: jspb.BinaryReader): StorageInformation;
}

export namespace StorageInformation {
  export type AsObject = {
    fstype: string,
    total: number,
    free: number,
    used: number,
    usedpercent: number,
  }
}

