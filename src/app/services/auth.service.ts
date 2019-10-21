import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

import { GetAddressFromPublicKey } from '../../helpers/utils';
import { KeyringService } from './keyring.service';
import { TransactionService, Transactions } from './transaction.service';
import { AccountService } from './account.service';

export interface SavedAccount {
  path: number;
  name: string;
  nodeIP: string;
  address: string;
  balance?: number;
  lastTx?: number;
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
  // seedPhrase: string = 'sasdasda';

  constructor(
    private keyringServ: KeyringService,
    private transactionServ: TransactionService,
    private accServ: AccountService
  ) {}

  generateDerivationPath(): number {
    const accounts: SavedAccount[] =
      JSON.parse(localStorage.getItem('ACCOUNT')) || [];

    // find length of not imported account. the result is the new derivation path
    return accounts.length;
  }

  isPinValid(encSeed: string, key: string): boolean {
    let isPinValid = false;
    try {
      const seed = CryptoJS.AES.decrypt(encSeed, key).toString(
        CryptoJS.enc.Utf8
      );
      if (!seed) throw 'not match';
      isPinValid = true;
    } catch (e) {
      isPinValid = false;
    }
    return isPinValid;
  }

  login(account: SavedAccount, key: string) {
    let seed: string;
    let publicKey: Uint8Array;
    let address: string;

    // get master seed to create child seed
    const encSeed = localStorage.getItem('ENC_MASTER_SEED');
    seed = CryptoJS.AES.decrypt(encSeed, key).toString(CryptoJS.enc.Utf8);

    this.keyringServ.calcBip32RootKeyFromSeed(coin, Buffer.from(seed, 'hex'));

    // create child seed with derivation path to generate pubkey and address
    const childSeed = this.keyringServ.calcForDerivationPathForCoin(
      coin,
      account.path
    );

    publicKey = childSeed.publicKey;
    address = GetAddressFromPublicKey(publicKey);

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

  getAllAccount(fullProps = false): SavedAccount[] {
    let accounts: SavedAccount[] =
      JSON.parse(localStorage.getItem('ACCOUNT')) || [];

    if (fullProps) {
      accounts.map(async acc => {
        await this.transactionServ
          .getAccountTransaction(1, 1, acc.address)
          .then((res: Transactions) => {
            if (res.transactions.length > 0)
              acc.lastTx = res.transactions[0].timestamp;
            else acc.lastTx = null;
          });
        await this.accServ.getAccountBalance(acc.address).then((res: any) => {
          acc.balance = parseInt(res.accountbalance.spendablebalance);
        });
        return acc;
      });
    }

    return accounts;
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

  savePassphraseSeed(passphrase: string, key: string) {
    const encPassphraseSeed = CryptoJS.AES.encrypt(passphrase, key).toString();
    localStorage.setItem('ENC_PASSPHRASE_SEED', encPassphraseSeed);
  }
}
