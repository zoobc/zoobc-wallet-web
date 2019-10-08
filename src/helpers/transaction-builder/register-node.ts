import {
  bigintToByteArray,
  BigInt,
  readInt64,
  fromBase64Url,
  base64ToByteArray,
  toBase64Url,
  byteArrayToBase64,
} from '../converters';
import { AuthService } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import {
  TRANSACTION_TYPE_OFFSET,
  VERSION_OFFSET,
  TIMESTAMP_OFFSET,
  ADDRESS_LENGTH,
  SENDER_LENGTH_OFFSET,
  BODY_LENGTH_OFFSET,
  SENDER_OFFSET,
  FEE_OFFSET,
} from './constant';

const REGISTER_NODE_LENGTH = 469;
const HEADER_BODY_LENGTH = 129;

const NODE_PUBLIC_KEY_OFFSET = 117;
const ACCOUNT_ADDRESS_LENGTH_OFFSET = 149;
const ACCOUNT_ADDRESS_OFFSET = 153;
const NODE_ADDRESS_LENGTH_OFFSET = 197;
const NODE_ADDRESS_OFFSET = 201;
const FUND_OFFSET = 245;
const POOWN_OFFSET = 253;
const SIGNATURE_TYPE_OFFSET = 397;
const SIGNATURE_OFFSET = 401;

export class RegisterNode {
  private bytes: Buffer;

  authServ: AuthService;
  keyringServ: KeyringService;

  constructor() {
    this.bytes = new Buffer(REGISTER_NODE_LENGTH);
    // transaction type
    this.bytes.writeInt32LE(1, TRANSACTION_TYPE_OFFSET);
    // version
    this.bytes.writeInt8(1, VERSION_OFFSET);
    // timestamp
    const timestamp = Math.trunc(Date.now() / 1000);
    this.bytes.set(bigintToByteArray(BigInt(timestamp)), TIMESTAMP_OFFSET);
    // account address length
    this.bytes.writeInt32LE(ADDRESS_LENGTH, SENDER_LENGTH_OFFSET);
    this.bytes.writeInt32LE(ADDRESS_LENGTH, ACCOUNT_ADDRESS_LENGTH_OFFSET);
    // node address length
    this.bytes.writeInt32LE(ADDRESS_LENGTH, NODE_ADDRESS_LENGTH_OFFSET);
    // tx body length
    this.bytes.writeInt32LE(8, BODY_LENGTH_OFFSET);
    // set signature type
    this.bytes.writeInt32LE(0, SIGNATURE_TYPE_OFFSET);
  }

  get value(): Buffer {
    return this.bytes;
  }

  set fee(fee: number) {
    this.bytes.set(bigintToByteArray(BigInt(fee * 1e8)), FEE_OFFSET);
  }

  get fee(): number {
    return readInt64(this.bytes, FEE_OFFSET) / 1e8;
  }

  set accountAddress(address: string) {
    const addressBytes = Buffer.from(address, 'utf-8');
    if (addressBytes.length != 44) throw new Error();
    this.bytes.set(addressBytes, SENDER_OFFSET);
    this.bytes.set(addressBytes, ACCOUNT_ADDRESS_OFFSET);
  }

  get accountAddress(): string {
    const addressBytes = this.bytes.slice(
      SENDER_OFFSET,
      SENDER_OFFSET + ADDRESS_LENGTH
    );
    return addressBytes.toString('utf-8');
  }

  set nodePublicKey(address: string) {
    const addressBytes = base64ToByteArray(fromBase64Url(address));
    if (addressBytes.length != 32) throw new Error();
    this.bytes.set(addressBytes, NODE_PUBLIC_KEY_OFFSET);
  }

  get nodePublicKey(): string {
    const addressBytes = this.bytes.slice(
      NODE_PUBLIC_KEY_OFFSET,
      NODE_PUBLIC_KEY_OFFSET + 32
    );
    return toBase64Url(byteArrayToBase64(addressBytes));
  }

  set nodeAddress(address: string) {
    const addressBytes = Buffer.from(address, 'utf-8');
    if (addressBytes.length != 44) throw new Error();
    this.bytes.set(addressBytes, NODE_ADDRESS_OFFSET);
  }

  get nodeAddress(): string {
    const addressBytes = this.bytes.slice(
      NODE_ADDRESS_OFFSET,
      NODE_ADDRESS_OFFSET + ADDRESS_LENGTH
    );
    return addressBytes.toString('utf-8');
  }

  set lockedFund(fund: number) {
    this.bytes.set(bigintToByteArray(BigInt(fund * 1e8)), FUND_OFFSET);
  }

  get lockedFund(): number {
    return readInt64(this.bytes, FUND_OFFSET) / 1e8;
  }

  set poown(byte: ArrayLike<number>) {
    this.bytes.set(byte, POOWN_OFFSET);
  }

  sign() {
    const account = this.authServ.getCurrAccount();
    const childSeed = this.keyringServ.calcForDerivationPathForCoin(
      'ZBC',
      account.path
    );
    const signature = childSeed.sign(this.bytes.slice(0, HEADER_BODY_LENGTH));
    this.bytes.set(signature, SIGNATURE_OFFSET);
  }
}
