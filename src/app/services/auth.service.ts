import { Injectable } from '@angular/core';
import zoobc, { BIP32Interface, ZooKeyring, AccountBalance, Address, isZBCAddressValid } from 'zbc-sdk';
import { BehaviorSubject } from 'rxjs';

export type AccountType = 'normal' | 'multisig' | 'one time login' | 'imported' | 'hardware' | 'address';
export interface SavedAccount {
  name: string;
  path?: number;
  type: AccountType;
  nodeIP?: string;
  address: Address;
  participants?: Address[];
  nonce?: number;
  minSig?: number;
  balance?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean = false;
  private _seed: BIP32Interface;
  private _keyring: ZooKeyring;

  private sourceCurrAccount = new BehaviorSubject<SavedAccount>(null);
  currAccount = this.sourceCurrAccount.asObservable();

  constructor() {
    const account = this.getCurrAccount();
    this.sourceCurrAccount.next(account);
  }

  get seed() {
    return this._seed;
  }

  get keyring() {
    return this._keyring;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  generateDerivationPath(): number {
    const accounts: SavedAccount[] = JSON.parse(localStorage.getItem('ACCOUNT')) || [];
    const highestPath = Math.max.apply(Math, accounts.map(res => res.path));
    return highestPath + 1;
  }

  login(key: string): boolean {
    const encPassphrase = localStorage.getItem('ENC_PASSPHRASE_SEED');
    const passphrase = zoobc.Wallet.decryptPassphrase(encPassphrase, key);

    if (passphrase) {
      const accounts = this.getAllAccount();
      let account = this.getCurrAccount();
      account =
        account.type == 'one time login' || account.type == 'address' ? accounts[0] : this.getCurrAccount();
      this.sourceCurrAccount.next(account);
      localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));

      this._keyring = new ZooKeyring(passphrase);
      this._seed = this._keyring.calcDerivationPath(account.path);

      return (this.loggedIn = true);
    }
    return false;
  }

  loginWithoutPin(account: SavedAccount, seed?: BIP32Interface): boolean {
    if (!isZBCAddressValid(account.address.value)) return false;
    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
    this.sourceCurrAccount.next(account);

    if (seed) this._seed = seed;
    return (this.loggedIn = true);
  }

  logout() {
    this.loggedIn = false;
    this._keyring = null;
    this._seed = null;
  }

  switchAccount(account: SavedAccount, onlySeed: boolean = false) {
    if (!onlySeed) {
      localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
      this.sourceCurrAccount.next(account);
    }
    if (account.path != null) this._seed = this._keyring.calcDerivationPath(account.path);
  }

  getCurrAccount(): SavedAccount {
    return JSON.parse(localStorage.getItem('CURR_ACCOUNT'));
  }

  getAllAccount(type?: AccountType): SavedAccount[] {
    let accounts: SavedAccount[] = JSON.parse(localStorage.getItem('ACCOUNT')) || [];

    if (type == 'normal') return accounts.filter(acc => acc.type == 'normal');
    else if (type == 'multisig') return accounts.filter(acc => acc.type == 'multisig');
    else if (type == 'imported') return accounts.filter(acc => acc.type == 'imported');
    else if (type == 'one time login') return [this.getCurrAccount()];
    return accounts;
  }

  getAccountsWithBalance(type?: AccountType): Promise<SavedAccount[]> {
    return new Promise(async (resolve, reject) => {
      const accounts = this.getAllAccount(type);
      const addresses = accounts.map(acc => acc.address);
      zoobc.Account.getBalances(addresses)
        .then((accountBalances: AccountBalance[]) => {
          accounts.map((acc, i) => {
            acc.balance = accountBalances[i].balance;
            return acc;
          });
          resolve(accounts);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  addAccount(account: SavedAccount) {
    const accounts = this.getAllAccount();
    const { address } = account;
    const isDuplicate = accounts.find(acc => {
      if (address.value && acc.address.value === address.value) return true;
      return false;
    });

    if (!isDuplicate) {
      accounts.push(account);
      localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
      this.switchAccount(account);
    }
  }
}
