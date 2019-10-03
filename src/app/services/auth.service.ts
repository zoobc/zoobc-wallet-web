import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

import { GetAddressFromPublicKey } from '../../helpers/utils';
import { KeyringService } from './keyring.service';

export interface SavedAccount {
  path: number;
  name: string;
  nodeIP: string;
}

const coin = 'ZBC';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currSeed: string;
  currPublicKey: Uint8Array;
  currAddress: string;
  // currSeed: string =
  //   'b88ddc803c5b30918e4fd23e6c6e7a9580d267d58607569b33048925c145cecf2dfa43dca8371b4a2506c922e76d31d2e213b3c599c16bf1a853a9b2b954a9fd';
  // currPublicKey: Uint8Array = Buffer.from(
  //   '9cafe8bb17430f0b898a88220c08bfcecd4ba9e37b7f966c5db16d5c6a867343',
  //   'hex'
  // );
  // currAddress: string = 'nK_ouxdDDwuJiogiDAi_zs1LqeN7f5ZsXbFtXGqGc0Pd';

  constructor(private keyringServ: KeyringService) {}

  generateDerivationPath(): number {
    const accounts: [SavedAccount] =
      JSON.parse(localStorage.getItem('ACCOUNT')) || [];

    // find length of not imported account. the result is the new derivation path
    return accounts.length;
  }

  login(account: SavedAccount, key: string) {
    let seed: string;
    let publicKey: Uint8Array;
    let address: string;

    // get master seed to create child seed
    const encSeed = localStorage.getItem('ENC_MASTER_SEED');
    const seedHex = CryptoJS.AES.decrypt(encSeed, key).toString(
      CryptoJS.enc.Utf8
    );

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
    // console.log('seed', seed);
    // console.log('pubkey', byteArrayToHex(publicKey));
    // console.log('address', address);

    this.currSeed = seed;
    this.currPublicKey = publicKey;
    this.currAddress = address;

    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
  }

  switchAccount(account: SavedAccount) {
    // create child seed with derivation path to generate pubkey and address
    const childSeed = this.keyringServ.calcForDerivationPathForCoin(
      coin,
      account.path
    );

    this.currPublicKey = childSeed.publicKey;
    this.currAddress = GetAddressFromPublicKey(this.currPublicKey);

    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
  }

  getCurrAccount(): SavedAccount {
    return JSON.parse(localStorage.getItem('CURR_ACCOUNT'));
  }

  getAllAccount() {
    return JSON.parse(localStorage.getItem('ACCOUNT')) || [];
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
      localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
      this.switchAccount(account);
    }
  }

  restoreAccount(account) {
    localStorage.setItem('ACCOUNT', JSON.stringify(account));
    this.switchAccount(account[0]);
  }

  saveMasterSeed(seedBase58: string, key: string) {
    const encSeed = CryptoJS.AES.encrypt(seedBase58, key).toString();
    this.currSeed = seedBase58;
    localStorage.setItem('ENC_MASTER_SEED', encSeed);
  }
}
