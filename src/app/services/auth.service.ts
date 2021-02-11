import { Injectable } from '@angular/core';
import zoobc, {
  BIP32Interface,
  ZooKeyring,
  getZBCAddress,
  TransactionListParams,
  Address,
  AccountBalance,
} from 'zbc-sdk';
import { environment } from 'src/environments/environment';

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
  private restoring = false;

  constructor() {}

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
    let accounts: SavedAccount[];
    if (environment.production) {
      accounts = JSON.parse(localStorage.getItem('ACCOUNT_MAIN')) || [];
    } else {
      accounts = JSON.parse(localStorage.getItem('ACCOUNT_TEST')) || [];
    }
    const highestPath = Math.max.apply(
      Math,
      accounts.map(res => {
        return res.path;
      })
    );
    return highestPath + 1;
  }

  login(key: string): boolean {
    // give some delay so that the dom have time to render the spinner
    let encPassphrase;
    if (environment.production) {
      encPassphrase = localStorage.getItem('ENC_PASSPHRASE_SEED_MAIN');
    } else {
      encPassphrase = localStorage.getItem('ENC_PASSPHRASE_SEED_TEST');
    }
    const passphrase = zoobc.Wallet.decryptPassphrase(encPassphrase, key);

    if (passphrase) {
      const account = this.getCurrAccount();
      this._keyring = new ZooKeyring(passphrase);
      this._seed = this._keyring.calcDerivationPath(account.path);

      return (this.loggedIn = true);
    }
    return (this.loggedIn = false);
  }

  logout() {
    this.loggedIn = false;
    this._keyring = null;
    this._seed = null;
  }

  switchAccount(account: SavedAccount) {
    if (environment.production) {
      localStorage.setItem('CURR_ACCOUNT_MAIN', JSON.stringify(account));
    } else {
      localStorage.setItem('CURR_ACCOUNT_TEST', JSON.stringify(account));
    }
    this._keyring.calcDerivationPath(account.path);
    this._seed = this._keyring.calcDerivationPath(account.path);
  }

  getCurrAccount(): SavedAccount {
    if (environment.production) return JSON.parse(localStorage.getItem('CURR_ACCOUNT_MAIN'));
    else return JSON.parse(localStorage.getItem('CURR_ACCOUNT_TEST'));
  }

  getAllAccount(type?: AccountType): SavedAccount[] {
    const net = environment.production ? 'MAIN' : 'TEST';
    let accounts: SavedAccount[] = JSON.parse(localStorage.getItem(`ACCOUNT_${net}`)) || [];

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
      if (address && acc.address === address) return true;
      return false;
    });

    if (!isDuplicate) {
      accounts.push(account);
      if (environment.production) {
        localStorage.setItem('ACCOUNT_MAIN', JSON.stringify(accounts));
      } else {
        localStorage.setItem('ACCOUNT_TEST', JSON.stringify(accounts));
      }
      this.switchAccount(account);
    }
  }
}
