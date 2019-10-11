import {
  base64ToByteArray,
  int32ToBytes,
  intToInt64Buffer,
} from '../converters';
import { SavedAccount } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { ADDRESS_LENGTH, VERSION } from './constant';

const TRANSACTION_TYPE = new Buffer([2, 2, 0, 0]);

export interface RemoveNodeInterface {
  accountAddress: string;
  fee: number;
  nodePublicKey: string;
}

export function removeNodeBuilder(
  data: RemoveNodeInterface,
  keyringServ: KeyringService
): Buffer {
  let bytes: Buffer;

  const timestamp = intToInt64Buffer(Math.trunc(Date.now() / 1000));
  const accountAddress = Buffer.from(data.accountAddress, 'utf-8');
  const recipient = new Buffer(ADDRESS_LENGTH);
  const addressLength = int32ToBytes(ADDRESS_LENGTH);
  const fee = intToInt64Buffer(data.fee * 1e8);

  const nodePublicKey = base64ToByteArray(data.nodePublicKey);
  const bodyLength = int32ToBytes(nodePublicKey.length);

  bytes = Buffer.concat([
    TRANSACTION_TYPE,
    VERSION,
    timestamp,
    addressLength,
    accountAddress,
    addressLength,
    recipient,
    fee,
    bodyLength,
    nodePublicKey,
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
