import { bigintToByteArray, BigInt, readInt64 } from '../converters';
import { AuthService } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import {
  TRANSACTION_TYPE_OFFSET,
  VERSION_OFFSET,
  TIMESTAMP_OFFSET,
  SENDER_LENGTH_OFFSET,
  RECIPIENT_LENGTH_OFFSET,
  BODY_LENGTH_OFFSET,
  SENDER_OFFSET,
  RECIPIENT_OFFSET,
  FEE_OFFSET,
  ADDRESS_LENGTH,
} from './constant';

const SEND_MONEY_LENGTH = 197;
const HEADER_BODY_LENGTH = 129;

const AMOUNT_OFFSET = 121;
const SIGNATURE_TYPE_OFFSET = 129;
const SIGNATURE_OFFSET = 133;

export class SendMoney {
  private bytes: Buffer;

  authServ: AuthService;
  keyringServ: KeyringService;

  constructor() {
    this.bytes = new Buffer(SEND_MONEY_LENGTH);
    // transaction type
    this.bytes.writeInt32LE(1, TRANSACTION_TYPE_OFFSET);
    // version
    this.bytes.writeInt8(1, VERSION_OFFSET);
    // timestamp
    const timestamp = Math.trunc(Date.now() / 1000);
    this.bytes.set(bigintToByteArray(BigInt(timestamp)), TIMESTAMP_OFFSET);
    // sender address length
    this.bytes.writeInt32LE(ADDRESS_LENGTH, SENDER_LENGTH_OFFSET);
    // recepient address length
    this.bytes.writeInt32LE(ADDRESS_LENGTH, RECIPIENT_LENGTH_OFFSET);
    // tx body length
    this.bytes.writeInt32LE(8, BODY_LENGTH_OFFSET);
    // set signature type
    this.bytes.writeInt32LE(0, SIGNATURE_TYPE_OFFSET);
  }

  get value(): Buffer {
    return this.bytes;
  }

  set sender(address: string) {
    const addressBytes = Buffer.from(address, 'utf-8');
    if (addressBytes.length != 44) throw new Error();
    this.bytes.set(addressBytes, SENDER_OFFSET);
  }

  get sender(): string {
    const addressBytes = this.bytes.slice(
      SENDER_OFFSET,
      SENDER_OFFSET + ADDRESS_LENGTH
    );
    return addressBytes.toString('utf-8');
  }

  set recipient(address: string) {
    const addressBytes = Buffer.from(address, 'utf-8');
    if (addressBytes.length != 44) throw new Error();
    this.bytes.set(addressBytes, RECIPIENT_OFFSET);
  }

  get recipient(): string {
    const addressBytes = this.bytes.slice(
      RECIPIENT_OFFSET,
      RECIPIENT_OFFSET + ADDRESS_LENGTH
    );
    return addressBytes.toString('utf-8');
  }

  set fee(fee: number) {
    this.bytes.set(bigintToByteArray(BigInt(fee * 1e8)), FEE_OFFSET);
  }

  get fee(): number {
    return readInt64(this.bytes, FEE_OFFSET) / 1e8;
  }

  set amount(amount: number) {
    this.bytes.set(bigintToByteArray(BigInt(amount * 1e8)), AMOUNT_OFFSET);
  }

  get amount(): number {
    return readInt64(this.bytes, FEE_OFFSET) / 1e8;
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
