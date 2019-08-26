import { bigintToByteArray, BigInt } from './converters';

export class BytesMaker {
  private bytes: Buffer;
  private offset: number = 0;

  constructor(length: number) {
    this.bytes = new Buffer(length);
  }

  get value() {
    return this.bytes;
  }

  write(array: ArrayLike<number>, length: number) {
    if (array.length != length) throw new Error();
    this.bytes.set(array, this.offset);
    this.offset += length;
  }

  write1Byte(value: number): void {
    this.bytes.writeInt8(value, this.offset);
    this.offset += 1;
  }

  write4bytes(value: number): void {
    this.bytes.writeInt32LE(value, this.offset);
    this.offset += 4;
  }

  write8Bytes(value: number): void {
    this.bytes.set(bigintToByteArray(BigInt(value)), this.offset);
    this.offset += 8;
  }

  write44Bytes(array: ArrayLike<number>): void {
    if (array.length != 44) throw new Error();
    this.bytes.set(array, this.offset);
    this.offset += 44;
  }
}
