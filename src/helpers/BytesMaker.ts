export class BytesMaker {
  private bytes: Buffer;

  constructor(length: number) {
    this.bytes = new Buffer(length);
  }

  write4bytes(value: number): void {
    this.bytes.writeInt32LE(value, 0);
  }
}
