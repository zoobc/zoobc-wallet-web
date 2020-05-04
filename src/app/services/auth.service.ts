import { Injectable } from '@angular/core';
import zoobc, { BIP32Interface, ZooKeyring, TransactionListParams, toTransactionListWallet } from 'zoobc-sdk';

export interface SavedAccount {
  name: string;
  path: number;
  type: 'normal' | 'multisig';
  nodeIP: string;
  address: string;
  participants?: [string];
  nonce?: number;
  minSig?: number;
  balance?: number;
  lastTx?: number;
  signByAddress?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean = false;
  private _seed: BIP32Interface;
  private _keyring: ZooKeyring;

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
    const accounts: SavedAccount[] = JSON.parse(localStorage.getItem('ACCOUNT')) || [];
    return accounts.length;
  }

  login(key: string): boolean {
    // give some delay so that the dom have time to render the spinner
    const encPassphrase = localStorage.getItem('ENC_PASSPHRASE_SEED');
    const passphrase = zoobc.Wallet.decryptPassphrase(encPassphrase, key);

    if (passphrase) {
      const account = this.getCurrAccount();
      this._keyring = new ZooKeyring(passphrase, 'p4ssphr4se');
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
    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
    this._keyring.calcDerivationPath(account.path);
    this._seed = this._keyring.calcDerivationPath(account.path);
  }

  getCurrAccount(): SavedAccount {
    return JSON.parse(localStorage.getItem('CURR_ACCOUNT'));
  }

  getAllAccount(type?: 'normal' | 'multisig'): SavedAccount[] {
    let accounts: SavedAccount[] = JSON.parse(localStorage.getItem('ACCOUNT')) || [];

    if (type == 'normal') return accounts.filter(acc => acc.type == 'normal');
    else if (type == 'multisig') return accounts.filter(acc => acc.type == 'multisig');
    return accounts;
  }

  getAccountsWithBalance(type?: 'normal' | 'multisig'): Promise<SavedAccount[]> {
    return new Promise(async (resolve, reject) => {
      let accounts = this.getAllAccount(type);

      let error = false;

      for (let i = 0; i < accounts.length; i++) {
        let account = accounts[i];
        let params: TransactionListParams = {
          address: account.address,
          transactionType: 1,
          pagination: {
            page: 1,
            limit: 1,
          },
        };

        await zoobc.Transactions.getList(params)
          .then(res => {
            const tx = toTransactionListWallet(res, account.address);
            if (tx.transactions.length > 0) account.lastTx = tx.transactions[0].timestamp;
            else account.lastTx = null;
            return zoobc.Account.getBalance(account.address);
          })
          .then(res => {
            account.balance = parseInt(res.accountbalance.spendablebalance);
          })
          .catch(err => {
            error = true;
            reject(err);
          });

        if (error) break;
      }
      if (!error) resolve(accounts);
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
      localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
      this.switchAccount(account);
    }
  }
}
