import * as BN from 'bn.js'

declare const Buffer

export function hexToByteArray(hexStr : string) : Uint8Array {
  return new Uint8Array(hexStr.match(/[\da-f]{2}/gi).map(byte => parseInt(byte, 16)));
}

export function byteArrayToHex(bytes: ArrayBuffer | ArrayBufferView | Array<number>) : string {
  const byteArray = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : ArrayBuffer.isView(bytes) ? new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength) : Uint8Array.from(bytes);
  return Array.prototype.map.call(byteArray, byte => byte.toString(16).padStart(2, "0")).join('');
}

/*
 * See: https://developers.google.com/web/updates/2014/08/Easier-ArrayBuffer-String-conversion-with-the-Encoding-API
 */
export function stringToByteArray(str: string) : Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

export function byteArrayToString(bytes: ArrayBuffer | ArrayBufferView | Array<number>) : string {
  const byteArray = bytes instanceof ArrayBuffer ? bytes : ArrayBuffer.isView(bytes) ? bytes : Uint8Array.from(bytes);
  const decoder = new TextDecoder();
  return decoder.decode(byteArray);
}

export function base64ToByteArray(base64Str: string) : Uint8Array {
  const buf = new Buffer(base64Str, 'base64');
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

export function byteArrayToBase64(bytes: ArrayBuffer | ArrayBufferView | Array<number>) : string {
  // const byteArray = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : ArrayBuffer.isView(bytes) ? new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength) : Uint8Array.from(bytes);
  // return btoa([].reduce.call(byteArray, (acc, byte) => acc + String.fromCharCode(byte), ''));
  const buf = bytes instanceof ArrayBuffer ? Buffer.from(bytes) : ArrayBuffer.isView(bytes) ? Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength) : Buffer.from(bytes);
  return buf.toString('base64');
}

export function toBase64Url(base64Str: string) : string {
  return base64Str.replace(/\+/g, '-').replace(/\//g, '_');
}

export function fromBase64Url(base64Str: string) : string {
  return base64Str.replace(/\-/g, '+').replace(/\_/g, '/');
}

export function mergeByteArrays(resultConstructor, arrays: Array<ArrayBufferView | number[]>) {
  let totalLength = arrays.reduce((acc, arr) => ((arr as ArrayBufferView).byteLength || (arr as number[]).length) + acc, 0);
  let result = new resultConstructor(totalLength);
  let offset = 0;
  for (let arr of arrays) {
      const len = (arr as ArrayBufferView).byteLength || (arr as number[]).length;
      result.set(arr, offset);
      offset += len;
  }
  return result;
}

export function publicKeyToAddress(hexOrBytes: string | ArrayBuffer | ArrayBufferView | Array<number>) : string {
  const bytes = (typeof hexOrBytes === 'string') ? hexToByteArray(hexOrBytes) : hexOrBytes instanceof ArrayBuffer ? new Uint8Array(hexOrBytes) : ArrayBuffer.isView(hexOrBytes) ? hexOrBytes : Uint8Array.from(hexOrBytes);

  const addressBytes = mergeByteArrays(Uint8Array, [bytes, getAddressChecksum(bytes)]);
  return toBase64Url(byteArrayToBase64(addressBytes));
}

export function addressToPublicKey(address: string) : Uint8Array {
  const addressBytes = base64ToByteArray(fromBase64Url(address));
  // return addressBytes.subarray(0, addressBytes.length - 1);
  return new Uint8Array(addressBytes.buffer, addressBytes.byteOffset, addressBytes.byteLength - 1);
}

export function getAddressChecksum(bytes: ArrayBuffer | ArrayBufferView | Array<number>) : Uint8Array {
  const view : DataView = bytes instanceof ArrayBuffer ? new DataView(bytes) : ArrayBuffer.isView(bytes) ? new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength) : new DataView(Uint8Array.from(bytes).buffer);
  const n = view.byteLength;
  let a = 0;
  for (let i = 0; i < n; i++) {
    a = (a + view.getUint8(i)) % 256
  }
  return Uint8Array.from([a]);
}

export function BigInt(number: number, base? , endian?): BN {
  return new BN(number, base, endian);
}

export function bigintToByteArray(bn: BN) : Uint8Array {
  return bn.toArrayLike(Uint8Array,"le", 8);
}
