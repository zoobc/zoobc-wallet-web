import { Injectable } from '@angular/core';
import { wordlist } from '../../assets/js/wordlist';
import * as sha256 from 'sha256';
// import { SHA3 } from 'sha3';
import { eddsa as EdDSA } from 'elliptic';

import { AccountBalancesServiceClient } from '../grpc/service/accountBalanceServiceClientPb';
import {
  GetAccountBalanceRequest,
  AccountBalance
} from '../grpc/model/accountBalance_pb';

import { environment } from "../../environments/environment";
import { AppService } from '../app.service'
import {
  toBase64Url,
  stringToByteArray
} from "../../helpers/converters"

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  accBalanceServ: AccountBalancesServiceClient

  constructor(private appServ: AppService) {
    this.accBalanceServ = new AccountBalancesServiceClient(environment.grpcUrl, null, null);
  }

  generatePhraseWords(): string[] {
    const crypto = window.crypto;
    const phraseWords = [];

    if (crypto) {
      const bits = 128;
      const random = new Uint32Array(bits / 32);
      crypto.getRandomValues(random);
      const n = wordlist.length;
      let x: any;
      let w1: any;
      let w2: any;
      let w3: any;

      for (let i = 0; i < random.length; i++) {
        x = random[i];
        w1 = x % n;
        w2 = (((x / n) >> 0) + w1) % n;
        w3 = (((((x / n) >> 0) / n) >> 0) + w2) % n;
        phraseWords.push(wordlist[w1]);
        phraseWords.push(wordlist[w2]);
        phraseWords.push(wordlist[w3]);
      }
    }
    return phraseWords;
  }

  VerifySignature(key, signature, data) {
    const result = key.verify(data, signature);
    return result;
  }

  GetSignature(key, data): any {
    const signature = key.sign(data);
    return signature;
  }

  // GetAddressFromPublicKey Get the formatted address from a raw public key
  GetAddressFromPublicKey(publicKey) {
    // console.log(publicKey);
    
    const checksum = this.GetChecksumByte(publicKey);
    const addressBuffer = [...publicKey, checksum[0]];

    // change to base64
    let binary = '';
    const bytes = new Uint8Array(addressBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const address = toBase64Url(window.btoa(binary));
    // console.log(address);
    
    return address;
  }

  // GetSeedFromPhrase(phrase: string) {
  //   const seedHash = new SHA3(256);
  //   seedHash.update(phrase);
  //   return seedHash.digest();
  // }

  GetSeedFromPhrase(phrase: string) {
    const seed = sha256(stringToByteArray(phrase), { asBytes: true });
    return seed;
  }
  

  GetKeyPairFromSeed(seed: ArrayLike<number>): any {
    const ec = new EdDSA('ed25519');
    const keyPair = ec.keyFromSecret(seed);
    return keyPair;
  }

  GetPublicKeyFromSeed(seed: ArrayLike<number>): any {
    return this.GetKeyPairFromSeed(seed).getPublic();
  }

  GetChecksumByte(bytes): any {
    let n = bytes.length;
    let a = 0;
    for (let i = 0; i < n; i++) { a += bytes[i]; }
    const res = new Uint8Array([a]);
    return res;
  }

  getAccountBalance() {
    let publicKey = this.appServ.currPublicKey
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

}
