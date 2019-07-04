import { Injectable } from '@angular/core';
import * as ecc from 'tiny-secp256k1';
import * as wif from 'wif';
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
  secret?: string;
  path?: number;
  name: string;
  imported: boolean;
}

const coin = 'ZBC';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  accBalanceServ: AccountBalancesServiceClient;
  accounts: [] = JSON.parse(localStorage.getItem('accounts')) || [];

  currSeed: string;
  currPublicKey: Uint8Array;
  currAddress: string;

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
    // filter only not imported account
    const filterAcc = accounts.filter(acc => !acc.imported);

    // find length of not imported account. the result is the new derivation path
    return filterAcc.length;
  }

  changeCurrentAccount(account: SavedAccount) {
    const pin = localStorage.getItem('pin');
    console.log(account);

    if (pin) {
      let seed: string;
      let publicKey: Uint8Array;
      let address: string;

      if (account.imported) {
        // switch to imported account

        // decode wif private key to generate pubkey and address
        const decoded = wif.decode(account.secret);
        const privateKey = decoded.privateKey;

        seed = byteArrayToHex(privateKey);
        publicKey = ecc.pointFromScalar(privateKey, decoded.compressed);
        address = GetAddressFromPublicKey(publicKey);
      } else {
        // switch to HD wallet

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
        console.log('seed', childSeed);
        console.log('pubkey', byteArrayToHex(publicKey));

        this.currSeed = seed;
      }

      this.currPublicKey = publicKey;
      this.currAddress = address;

      localStorage.setItem('currAccount', JSON.stringify(account));
    }
  }

  getCurrAccount() {
    return JSON.parse(localStorage.getItem('currAccount'));
  }

  getAllAccount() {
    return JSON.parse(localStorage.getItem('accounts')) || [];
  }

  addAccount(account: SavedAccount) {
    const accounts = this.getAllAccount();
    const { path, secret } = account;
    const isDuplicate = accounts.find(acc => {
      if (path && acc.path === path) return true;
      if (secret && acc.secret === secret) return true;
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
