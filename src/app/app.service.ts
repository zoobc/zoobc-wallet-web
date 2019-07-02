import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import * as bip32 from 'bip32';
import { BIP32Interface } from 'bip32';
import { GetAddressFromPublicKey } from '../helpers/utils';
import { byteArrayToHex, hexToByteArray } from '../helpers/converters';
import { HttpClient } from '@angular/common/http';
import * as base58 from 'bs58';
import * as ecc from 'tiny-secp256k1';
import * as wif from 'wif';

export interface SavedAccount {
  secret?: string;
  path?: string;
  name: string;
  imported: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AppService implements CanActivate {
  private sourceCurrSeed = new BehaviorSubject('');
  private sourceCurrPublicKey = new BehaviorSubject('');
  private sourceCurrAddress = new BehaviorSubject('');

  currSeed: BIP32Interface;
  currPublicKey: Uint8Array;
  currAddress: string;

  constructor(private router: Router, private http: HttpClient) {
    this.sourceCurrSeed.subscribe(seedBase58 => {
      console.log(seedBase58);
      if (seedBase58) this.currSeed = bip32.fromBase58(seedBase58);
    });

    this.sourceCurrPublicKey.subscribe(pubKeyHex => {
      if (pubKeyHex) this.currPublicKey = hexToByteArray(pubKeyHex);
    });

    this.sourceCurrAddress.subscribe(address => {
      this.currAddress = address;
    });
  }

  changeCurrentAccount(account: SavedAccount) {
    const pin = localStorage.getItem('pin');

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
        const seedBase58 = CryptoJS.AES.decrypt(
          localStorage.getItem('encMasterSeed'),
          pin
        ).toString(CryptoJS.enc.Utf8);
        const masterSeed: BIP32Interface = bip32.fromBase58(seedBase58);
        // create child seed with derivation path to generate pubkey and address
        const childSeed = masterSeed.derivePath(account.path);

        seed = masterSeed.toBase58();
        publicKey = childSeed.publicKey.slice(1, 33);
        address = GetAddressFromPublicKey(publicKey);

        this.sourceCurrSeed.next(seed);
      }

      // save current pubkey and address to global variable (behavior subject) for auth
      this.sourceCurrPublicKey.next(byteArrayToHex(publicKey));
      this.sourceCurrAddress.next(address);

      localStorage.setItem('currAccount', JSON.stringify(account));
      // console.log(masterSeed.toBase58());
      // console.log(byteArrayToHex(publicKey));
      // console.log(address);
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

  isLoggedIn() {
    return this.currPublicKey ? true : false;
  }

  canActivate(): boolean {
    if (this.currPublicKey) return true;
    this.router.navigateByUrl('/login');
    return false;
  }
}

// Language
export const LANGUAGES = [
  {
    country: 'English',
    code: 'en',
  },
  {
    country: 'Indonesia',
    code: 'id',
  },
];
