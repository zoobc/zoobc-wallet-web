import { int32ToBytes, intToInt64Buffer } from '../converters';
import { SavedAccount } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { ADDRESS_LENGTH, VERSION } from './constant';

const TRANSACTION_TYPE = new Buffer([1, 0, 0, 0]);

export interface SendMoneyInterface {
  sender: string;
  recipient: string;
  fee: number;
  amount: number;
}

export function sendMoneyBuilder(
  data: SendMoneyInterface,
  keyringServ: KeyringService
): Buffer {
  let bytes: Buffer;

  const timestamp = intToInt64Buffer(Math.trunc(Date.now() / 1000));
  const sender = Buffer.from(data.sender, 'utf-8');
  const recipient = Buffer.from(data.recipient, 'utf-8');
  const addressLength = int32ToBytes(ADDRESS_LENGTH);
  const fee = intToInt64Buffer(data.fee * 1e8);

  const amount = intToInt64Buffer(data.amount * 1e8);
  const bodyLength = int32ToBytes(amount.length);

  bytes = Buffer.concat([
    TRANSACTION_TYPE,
    VERSION,
    timestamp,
    addressLength,
    sender,
    addressLength,
    recipient,
    fee,
    bodyLength,
    amount,
  ]);

  const signatureType = int32ToBytes(0);
  const signature = sign(bytes, keyringServ);
  return Buffer.concat([bytes, signatureType, signature]);
}

function sign(bytes: Buffer, keyringServ: KeyringService): Buffer {
  const account: SavedAccount = JSON.parse(
    localStorage.getItem('CURR_ACCOUNT')
  );
  const childSeed = keyringServ.calcForDerivationPathForCoin(
    'ZBC',
    account.path
  );
  return Buffer.from(childSeed.sign(bytes));
}
