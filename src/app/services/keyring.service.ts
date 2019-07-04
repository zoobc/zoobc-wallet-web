import { Injectable, Inject } from '@angular/core';

import { MnemonicsService } from './mnemonics.service';
// import { APP_CONFIG, AppConfig } from "../app-config.module";
import * as base58 from 'bs58';

import {
  BIP32Interface,
  Network,
  fromSeed,
  getDerivationPath,
  findDerivationPathErrors,
  displayBip32Info,
} from '../../helpers/childkeys';

import { findCoin } from '../../helpers/coins';
import { byteArrayToHex, hexToByteArray } from 'src/helpers/converters';

const NOT_IMPLEMENTED = 'Not Implemented';

@Injectable({
  providedIn: 'root',
})
export class KeyringService {
  // Each (hardware) wallet has only one seed. The seed can be represented in words.
  // One seed can be used for more than one network (e.g. Bitcoin, Ethereum, Ethereum Class, Ripple).
  // Unique rootKeys are generated for each network.
  // One rootKey can have multiple accounts (to separate balances, e.g. Savings / Current)
  // One account can have multiple sub-addresses (consolidated into a single balance)
  // Each sub-adddress has its own private-key and public-key (the "address")
  // Transactions can have unlimited number of "inputs" (sub-addresses used as source of coins).
  // Transaction must be signed by each address-level private-keys involved as an input.
  // Multiple signatures are attached to the transaction for verification.

  /**
   * Use seed.toString('hex') to get hexadecimal format.
   */
  private seed: Buffer;
  private bip32RootKey: BIP32Interface;
  // private bip32ExtendedKey: BIP32Interface;

  constructor(
    private mnemonicsService: MnemonicsService,
    // @Inject(APP_CONFIG) private config: AppConfig,
    @Inject('nacl.sign') private ed25519: any,
    @Inject('global') private global: any
  ) {}

  getNetwork(networkName: string): Network {
    const networkConfig: Network =
      this.global &&
      this.global.bitcoinjs &&
      this.global.bitcoinjs.bitcoin &&
      this.global.bitcoinjs.bitcoin.networks
        ? this.global.bitcoinjs.bitcoin.networks[networkName]
        : undefined;
    // if (!networkConfig) {
    //   throw new Error("network not found in bitcoinjs' list");
    // }
    return networkConfig;
  }

  generateRandomPhrase(numWords?: number): { [key: string]: string } {
    const [words, entropyHex] = this.mnemonicsService.generateMnemonicWords(
      numWords
    );
    return {
      phrase: words,
      entropy: entropyHex,
      entropyMnemonicLength: 'raw',
    };
  }

  calcBip32RootKeyFromSeed(coinName: string, seed: Buffer) {
    const { network: networkName, curveName = 'secp256k1' } = findCoin(
      coinName
    );

    this.seed = seed;
    this.bip32RootKey = fromSeed(seed, this.getNetwork(networkName), curveName);

    return {
      seed: this.seed.toString('hex'),
      // bip32RootKey: this.bip32RootKey
    };
  }

  calcBip32RootKeyFromMnemonic(
    coinName: string,
    mnemonic: string,
    passphrase: string
  ) {
    const { network: networkName, curveName = 'secp256k1' } = findCoin(
      coinName
    );
    this.seed = this.mnemonicsService.toSeed(mnemonic, passphrase);

    this.bip32RootKey = fromSeed(
      this.seed,
      this.getNetwork(networkName),
      curveName
    );

    // this.bip32RootKey = fromSeed(
    //   this.seed,
    //   this.getNetwork(networkName),
    //   curveName
    // );
    return {
      seed: this.seed.toString('hex'),
      // bip32RootKey: this.bip32RootKey
    };
  }

  calcForDerivationPathForCoin(
    coinName: string,
    accountValue: number,
    changeValue: 0 | 1 = 0,
    bip32RootKey: BIP32Interface = this.bip32RootKey
  ) {
    const {
      curveName = 'secp256k1',
      derivationStandard = 'bip44',
      purposeValue = '44',
      coinValue,
    } = findCoin(coinName);

    return this.calcForDerivationPath(
      curveName,
      derivationStandard,
      String(purposeValue),
      String(coinValue),
      String(accountValue),
      String(changeValue),
      bip32RootKey
    );
  }

  calcForDerivationPath(
    curveName: 'secp256k1' | 'P-256' | 'ed25519',
    derivationStandard: string,
    purposeValue: string,
    coinValue: string,
    accountValue: string,
    changeValue: string = '0',
    bip32RootKey: BIP32Interface = this.bip32RootKey
  ) {
    // clearDerivedKeys();
    // clearAddressesList();
    // showPending();
    //
    // TODO: Segwit support
    // Don't show segwit if it's selected but network doesn't support it
    // if (segwitSelected() && !networkHasSegwit()) {
    //     showSegwitUnavailable();
    //     hidePending();
    //     return;
    // }
    // showSegwitAvailable();
    //
    // Get the derivation path
    var derivationPath = getDerivationPath(
      derivationStandard,
      purposeValue,
      coinValue,
      accountValue,
      changeValue
    );
    var errorText = findDerivationPathErrors(derivationPath);
    if (errorText) {
      // showValidationError(errorText);
      throw new Error(errorText);
    }
    const bip32ExtendedKey = bip32RootKey.derivePath(derivationPath, curveName);
    // const bip32ExtendedKey = calcBip32ExtendedKey(derivationPath, curveName, bip32RootKey);
    // this.bip32ExtendedKey = bip32ExtendedKey;

    const ed25519 = this.ed25519;
    const derivedNode = {
      derivationPath,
      ...displayBip32Info(bip32RootKey, bip32ExtendedKey),
      _publicKey: null,
      get publicKey() {
        if (!this._publicKey) {
          if (curveName === 'secp256k1') {
            this._publicKey = bip32ExtendedKey.publicKey;
          } else if (curveName === 'ed25519') {
            this._publicKey = ed25519.keyPair.fromSeed(
              bip32ExtendedKey.privateKey
            ).publicKey;
          } else {
            throw new Error(NOT_IMPLEMENTED);
          }
        }
        return this._publicKey;
      },
      sign(message: Uint8Array | Buffer, lowR?: boolean): Buffer {
        if (curveName === 'secp256k1') {
          return bip32ExtendedKey.sign(
            !Buffer.isBuffer(message) ? Buffer.from(message) : message,
            lowR
          );
        } else if (curveName === 'ed25519') {
          const { secretKey } = ed25519.keyPair.fromSeed(
            bip32ExtendedKey.privateKey
          );
          return ed25519.detached(message, secretKey);
        } else {
          throw new Error(NOT_IMPLEMENTED);
        }
      },
      verify(
        message: Uint8Array | Buffer,
        signature: Uint8Array | Buffer
      ): boolean {
        if (curveName === 'secp256k1') {
          return bip32ExtendedKey.verify(
            !Buffer.isBuffer(message) ? Buffer.from(message) : message,
            !Buffer.isBuffer(signature) ? Buffer.from(signature) : signature
          );
        } else if (curveName === 'ed25519') {
          return ed25519.detached.verify(message, signature, this.publicKey);
        } else {
          throw new Error(NOT_IMPLEMENTED);
        }
      },
    };

    if (['sep5', 'bip44', 'bip49', 'bip84'].includes(derivationStandard)) {
      // Calculate the account extended keys
      const extraSliceTo = ['bip44', 'bip49', 'bip84'].includes(
        derivationStandard
      )
        ? 1
        : 0;
      const accountPath = derivationPath.slice(
        0,
        derivationPath.lastIndexOf('/') + extraSliceTo
      );
      const accountExtendedKey = bip32RootKey.derivePath(
        accountPath,
        curveName
      );
      // const accountExtendedKey = calcBip32ExtendedKey(accountPath, curveName, bip32RootKey);
      const accountXprv = accountExtendedKey.toBase58();
      const accountXpub = accountExtendedKey.neutered().toBase58();
      return {
        ...derivedNode,
        accountPath,
        accountXprv,
        accountXpub,
      };
    } else {
      return derivedNode;
    }
  }

  //   phraseChanged() {
  //     showPending();
  //     setMnemonicLanguage();
  //     // Get the mnemonic phrase
  //     var phrase = DOM.phrase.val();
  //     var errorText = findPhraseErrors(phrase);
  //     if (errorText) {
  //         showValidationError(errorText);
  //         return;
  //     }
  //     // Calculate and display
  //     var passphrase = DOM.passphrase.val();
  //     calcBip32RootKeyFromSeed(phrase, passphrase);
  //     calcForDerivationPath();
  //     // Show the word indexes
  //     showWordIndexes();
  //   }

  //   networkChanged(e) {
  //     clearDerivedKeys();
  //     clearAddressesList();
  //     // DOM.litecoinLtubContainer.addClass("hidden");
  //     // DOM.bitcoinCashAddressTypeContainer.addClass("hidden");
  //     var networkIndex = e.target.value;
  //     var network = networks[networkIndex];
  //     network.onSelect();
  //     adjustNetworkForSegwit();
  //     if (seed != null) {
  //         phraseChanged();
  //     }
  //     else {
  //         rootKeyChanged();
  //     }
  // }
}
