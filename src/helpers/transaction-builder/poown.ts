import { int32ToBytes, intToInt64Bytes } from '../converters';
import { SavedAccount } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';

export function poownBuilder(
  requestType: number,
  keyringServ: KeyringService
): string {
  let bytes: Buffer;

  const timestamp = intToInt64Bytes(Date.now());
  const requestTypeBytes = int32ToBytes(requestType);
  bytes = Buffer.concat([timestamp, requestTypeBytes]);

  const signatureType = int32ToBytes(0);
  const signature = sign(bytes, keyringServ);
  return Buffer.concat([bytes, signatureType, signature]).toString('base64');
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
