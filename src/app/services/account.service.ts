import { Injectable } from '@angular/core';
import { wordlist } from '../../assets/js/wordlist';
import * as sha256 from 'sha256';
import { eddsa as EdDSA } from 'elliptic';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor() {
  }

  generateNewPassphrase(): any {
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

  VerifySignature(key, singnature, dataHash) {
    const result = key.verify(dataHash, singnature);
    return result;
  }

  GetSignature(key, dataHash): any {
    const signature = key.sign(dataHash).toHex();
    return signature;
  }

  GetAddressFromSeed(seed) {
    return this.GetAddressFromPublicKey(this.GetPublicKeyFromSeed(seed))
  }

  // GetAddressFromPublicKey Get the formatted address from a raw public key
  GetAddressFromPublicKey(publicKey) {
    const checksum = this.GetChecksumByte(publicKey);
    const addressBuffer = [...publicKey, checksum[0]];

    // change to base64
    let binary = '';
    const bytes = new Uint8Array(addressBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const address = window.btoa(binary);
    return address;
  }

  GetKeyPairFromSeed(seed): any {
    const seedBuffer = new TextEncoder().encode(seed);
    const seedHash = sha256(seedBuffer);
    const ec = new EdDSA('ed25519');
    const keyPair = ec.keyFromSecret(seedHash);
    return keyPair;
  }

  GetPublicKeyFromSeed(seed): any {
    const keyPair = this.GetKeyPairFromSeed(seed)
    const publicKey = keyPair.getPublic();
    return publicKey;
  }

  GetChecksumByte(bytes): any {
    let n = bytes.length;
    let a = 0;
    for (let i = 0; i < n; i++) { a += bytes[i]; }
    const res = new Uint8Array([a]);
    return res;
  }

}
