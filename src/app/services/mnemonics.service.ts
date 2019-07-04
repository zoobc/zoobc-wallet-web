import { Injectable, Inject } from '@angular/core';

import { APP_CONFIG, AppConfig } from '../app-config.module';

import { hexToByteArray } from '../../helpers/converters';

const INVALID_ENTROPY = 'Invalid entropy';
const INVALID_RNG = 'This browser does not support strong randomness';

function hasStrongRandom() {
  return 'crypto' in window && window['crypto'] !== null;
}

function randomBytes(size) {
  if (!hasStrongRandom()) {
    throw new Error(INVALID_RNG);
  }

  const buffer = new Uint8Array(size);
  // create secure entropy
  return crypto.getRandomValues(buffer);
}

function uint8ArrayToHex(byteArray) {
  return Array.prototype.map
    .call(byteArray, byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

@Injectable({
  providedIn: 'root',
})
export class MnemonicsService {
  private Mnemonic: (language: string) => void;

  public mnemonic: any;
  public mnemonics = new Map<string, any>();

  constructor(
    @Inject('global') private global: any,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.Mnemonic = global.Mnemonic;
    const language = config.mnemonicLanguage;

    const Mnemonic = this.Mnemonic;
    this.mnemonic = new Mnemonic(language);
    this.mnemonics.set(language, this.mnemonic);
  }

  setDefaultWordlist(language: string) {
    // Load the bip39 mnemonic generator for this language if required
    if (!this.mnemonics.has(language)) {
      const Mnemonic = this.Mnemonic;
      this.mnemonics.set(language, new Mnemonic(language));
    }
    this.mnemonic = this.mnemonics.get(language);
  }

  generateMnemonic(
    strength?: number,
    rng?: (size: number) => Uint8Array,
    wordlist?: string[]
  ): [string, string] {
    strength = strength || 128;
    if (strength % 32 !== 0) throw new TypeError(INVALID_ENTROPY);
    rng = rng || randomBytes;

    const randBytes = rng(strength / 8);
    return [this.toMnemonic(randBytes, wordlist), uint8ArrayToHex(randBytes)];
  }

  generateMnemonicWords(
    numWords: number = this.config.mnemonicNumWords,
    rng?: (size: number) => Uint8Array,
    wordlist?: string[]
  ): [string, string] {
    // get the amount of entropy to use
    const strength = (numWords / 3) * 32;
    return this.generateMnemonic(strength, rng, wordlist);
  }

  toSeed(mnemonic: string, password?: string): Buffer {
    const hexStr = this.mnemonic.toSeed(mnemonic, password);
    return Buffer.from(hexStr, 'hex');
  }

  toMnemonic(
    entropy: Uint8Array | Buffer | string,
    wordlist?: string[]
  ): string {
    const bytes =
      typeof entropy === 'string'
        ? hexToByteArray(entropy)
        : Buffer.isBuffer(entropy)
        ? entropy
        : entropy;
    return this.mnemonic.toMnemonic(bytes);
  }

  validateMnemonic(mnemonic: string, wordlist?: string[]): boolean {
    return this.mnemonic.check(mnemonic);
  }
}
