import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import zoobc, {
  BIP32Interface,
  ZooKeyring,
  TransactionListParams,
  toTransactionListWallet,
} from 'zoobc-sdk';
import { TransactionService, Transactions } from './transaction.service';
import { AccountService } from './account.service';
import { GetAccountBalanceResponse } from '../grpc/model/accountBalance_pb';

type AccountBalance = GetAccountBalanceResponse.AsObject;

export interface SavedAccount {
  path: number;
  name: string;
  nodeIP: string;
  address: string;
  balance?: number;
  lastTx?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean = false;
  private seed: BIP32Interface;

  constructor(
    private transactionServ: TransactionService,
    private accServ: AccountService
  ) {}

  get getSeed() {
    return this.seed;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  generateDerivationPath(): number {
    const accounts: SavedAccount[] =
      JSON.parse(localStorage.getItem('ACCOUNT')) || [];
    return accounts.length;
  }

  login(key: string): boolean {
    // give some delay so that the dom have time to render the spinner
    const encPassphrase = localStorage.getItem('ENC_PASSPHRASE_SEED');
    const passphrase = zoobc.Wallet.decryptPassphrase(encPassphrase, key);

    if (passphrase) {
      const account = this.getCurrAccount();
      const keyring = new ZooKeyring(passphrase, 'p4ssphr4se');

      this.seed = keyring.calcDerivationPath(account.path);

      return (this.loggedIn = true);
    }
    return (this.loggedIn = false);
  }

  logout() {
    this.loggedIn = false;
  }

  switchAccount(account: SavedAccount) {
    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
  }

  getCurrAccount(): SavedAccount {
    return JSON.parse(localStorage.getItem('CURR_ACCOUNT'));
  }

  getAllAccount(): SavedAccount[] {
    return JSON.parse(localStorage.getItem('ACCOUNT')) || [];
  }

  getAccountsWithBalance(): Promise<SavedAccount[]> {
    return new Promise(async (resolve, reject) => {
      let currAddress = this.getCurrAccount().address;
      let accounts = this.getAllAccount();

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

        zoobc.Transactions.getList(params)
          .then(res => {
            const tx = toTransactionListWallet(res, account.address);
            if (tx.transactions.length > 0) {
              account.lastTx = tx.transactions[0].timestamp;
            } else {
              account.lastTx = null;
            }
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

  editNodeIpAddress(newIp: string) {
    let account = this.getCurrAccount();
    let accounts = this.getAllAccount();

    account.nodeIP = newIp;
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].path == account.path) accounts[i] = account;
    }

    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
    localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
  }

  restoreAccount(account) {
    localStorage.setItem('ACCOUNT', JSON.stringify(account));
    this.switchAccount(account[0]);
  }

  savePassphraseSeed(passphrase: string, key: string) {
    const encPassphraseSeed = CryptoJS.AES.encrypt(passphrase, key).toString();
    localStorage.setItem('ENC_PASSPHRASE_SEED', encPassphraseSeed);
  }
}
