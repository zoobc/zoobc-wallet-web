import { Injectable } from '@angular/core';
import zoobc, {
  BIP32Interface,
  ZooKeyring,
  getZBCAdress,
  TransactionListParams,
  AccountBalancesResponse,
  TransactionsResponse,
} from 'zoobc-sdk';
import { BehaviorSubject } from 'rxjs';

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
  signByAddress?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean = false;
  private _seed: BIP32Interface;
  private _keyring: ZooKeyring;
  private restoring = false;

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
    return accounts.length;
  }

  login(key: string): boolean {
    // give some delay so that the dom have time to render the spinner
    const encPassphrase = localStorage.getItem('ENC_PASSPHRASE_SEED');
    const passphrase = zoobc.Wallet.decryptPassphrase(encPassphrase, key);

    if (passphrase) {
      const account = this.getCurrAccount();
      this.sourceCurrAccount.next(account);
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
    this.sourceCurrAccount.next(account);
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
      if (accounts.length == 0) return resolve(accounts);
      const addresses = accounts.map(acc => acc.address);

      zoobc.Account.getBalances(addresses)
        .then((res: AccountBalancesResponse) => {
          let balances = res.accountbalancesList;
          accounts.map(acc => {
            acc.balance = 0;
            for (let i = 0; i < balances.length; i++) {
              const balance = balances[i];
              if (balance.accountaddress == acc.address) {
                acc.balance = parseInt(balance.spendablebalance);
                balances.splice(i, 1);
                break;
              }
            }
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
      localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
      this.switchAccount(account);
    }
  }

  async restoreAccounts() {
    const isRestored: boolean = localStorage.getItem('IS_RESTORED') === 'true';
    if (!isRestored && !this.restoring) {
      this.restoring = true;
      const keyring = this._keyring;

      let accountPath: number = 0;
      let accountsTemp = [];
      let accounts = [];
      let counter: number = 0;

      while (counter < 20) {
        const childSeed = keyring.calcDerivationPath(accountPath);
        const publicKey = childSeed.publicKey;
        const address = getZBCAdress(publicKey);
        const account: SavedAccount = {
          name: 'Account '.concat((accountPath + 1).toString()),
          path: accountPath,
          nodeIP: null,
          address: address,
          type: 'normal',
        };
        const params: TransactionListParams = {
          address: address,
          transactionType: 1,
          pagination: {
            page: 1,
            limit: 1,
          },
        };
        await zoobc.Transactions.getList(params).then((res: TransactionsResponse) => {
          const totalTx = parseInt(res.total);
          accountsTemp.push(account);
          if (totalTx > 0) {
            accounts = accounts.concat(accountsTemp);
            accountsTemp = [];
            counter = 0;
          }
        });
        accountPath++;
        counter++;
      }
      localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
      localStorage.setItem('IS_RESTORED', 'true');

      this.restoring = false;
    }
  }
}
