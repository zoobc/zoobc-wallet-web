import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

import { AccountBalancesServiceClient } from '../grpc/service/accountBalanceServiceClientPb';
import {
  GetAccountBalanceRequest,
  AccountBalance,
} from '../grpc/model/accountBalance_pb';
import { environment } from '../../environments/environment';
import { GetAddressFromPublicKey } from '../../helpers/utils';
import { byteArrayToHex } from '../../helpers/converters';
import { KeyringService } from './keyring.service';

export interface SavedAccount {
  path: number;
  name: string;
}

export interface Account {
  balance: number;
  forgedbalance: number;
  height: number;
  id: number;
  publickey: string;
  unconfirmedbalance: number;
}

const coin = 'ZBC';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private accBalanceServ: AccountBalancesServiceClient;

  // currSeed: string;
  // currPublicKey: Uint8Array;
  // currAddress: string;
  currSeed: string =
    'e198d5f470d412f2902b50d7ba028f59f05bf51e5c1c7f23b0be8bb4cc6f5d3a9f37574f3c993c312e0b16a67b81e44e919b9c6ef3ada3f3a061c051c3db6709';
  currPublicKey: Uint8Array = Buffer.from(
    '04c92ac3fb75f8a6b91d61807d4812977d158a7a83b4a623c6a73ffb352a317f',
    'hex'
  );
  currAddress: string = 'BMkqw_t1-Ka5HWGAfUgSl30VinqDtKYjxqc_-zUqMX85';

  constructor(private keyringServ: KeyringService) {
    this.accBalanceServ = new AccountBalancesServiceClient(
      environment.grpcUrl,
      null,
      null
    );
  }

  getAccountBalance() {
    let publicKey = this.currPublicKey;
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();
      request.setPublickey(publicKey);

      this.accBalanceServ.getAccountBalance(
        request,
        null,
        (err, response: AccountBalance) => {
          if (err) return reject(err);
          resolve(response.toObject());
        }
      );
    });
  }

  generateDerivationPath(): number {
    const accounts: [SavedAccount] =
      JSON.parse(localStorage.getItem('accounts')) || [];

    // find length of not imported account. the result is the new derivation path
    return accounts.length;
  }

  changeCurrentAccount(account: SavedAccount) {
    const pin = localStorage.getItem('pin');

    if (pin) {
      let seed: string;
      let publicKey: Uint8Array;
      let address: string;

      // get master seed to create child seed
      const seedHex = CryptoJS.AES.decrypt(
        localStorage.getItem('encMasterSeed'),
        pin
      ).toString(CryptoJS.enc.Utf8);

      this.keyringServ.calcBip32RootKeyFromSeed(
        coin,
        Buffer.from(seedHex, 'hex')
      );

      // create child seed with derivation path to generate pubkey and address
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(
        coin,
        account.path
      );

      seed = seedHex;
      publicKey = childSeed.publicKey;
      address = GetAddressFromPublicKey(publicKey);
      console.log('seed', seed);
      console.log('pubkey', byteArrayToHex(publicKey));
      console.log('address', address);

      this.currSeed = seed;
      this.currPublicKey = publicKey;
      this.currAddress = address;

      localStorage.setItem('currAccount', JSON.stringify(account));
    }
  }

  getCurrAccount(): SavedAccount {
    return JSON.parse(localStorage.getItem('currAccount'));
  }

  getAllAccount() {
    return JSON.parse(localStorage.getItem('accounts')) || [];
  }

  addAccount(account: SavedAccount) {
    const accounts = this.getAllAccount();
    const { path } = account;
    const isDuplicate = accounts.find(acc => {
      if (path && acc.path === path) return true;
      return false;
    });

    if (!isDuplicate) {
      accounts.push(account);
      localStorage.setItem('accounts', JSON.stringify(accounts));
      this.changeCurrentAccount(account);
    }
  }

  saveMasterSeed(seedBase58: string) {
    const pin = localStorage.getItem('pin');
    if (pin) {
      const encSeed = CryptoJS.AES.encrypt(seedBase58, pin).toString();
      localStorage.setItem('encMasterSeed', encSeed);
    }
  }
}
