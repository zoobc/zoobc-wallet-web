import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { KeyringService } from './keyring.service';
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

const coin = 'ZBC';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean = true;
  // private loggedIn: boolean = false;

  constructor(
    private keyringServ: KeyringService,
    private transactionServ: TransactionService,
    private accServ: AccountService
  ) {}

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  generateDerivationPath(): number {
    const accounts: SavedAccount[] =
      JSON.parse(localStorage.getItem('ACCOUNT')) || [];
    return accounts.length;
  }

  isPinValid(encSeed: string, key: string): boolean {
    let isPinValid = false;
    try {
      const seed = CryptoJS.AES.decrypt(encSeed, key).toString(
        CryptoJS.enc.Utf8
      );
      if (!seed) throw 'not match';
      isPinValid = true;
    } catch (e) {
      isPinValid = false;
    }
    return isPinValid;
  }

  login(key: string): boolean {
    // give some delay so that the dom have time to render the spinner
    const encSeed = localStorage.getItem('ENC_MASTER_SEED');
    const isPinValid = this.isPinValid(encSeed, key);
    if (isPinValid) {
      const seed = Buffer.from(
        CryptoJS.AES.decrypt(encSeed, key).toString(CryptoJS.enc.Utf8),
        'hex'
      );
      this.keyringServ.calcBip32RootKeyFromSeed(coin, seed);
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
        await this.transactionServ
          .getTransactions(1, 1, account.address)
          .then((res: Transactions) => {
            if (res.transactions.length > 0)
              account.lastTx = res.transactions[0].timestamp;
            else account.lastTx = null;
            return this.accServ.getAccountBalance(accounts[i].address);
          })
          .then((res: AccountBalance) => {
            account.balance = parseInt(res.accountbalance.spendablebalance);
            accounts[i] = account;

            // update current account to local storage
            if (account.address == currAddress)
              localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
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
      if ((accounts[i].path = account.path)) accounts[i] = account;
    }
    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
    localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
  }

  restoreAccount(account) {
    localStorage.setItem('ACCOUNT', JSON.stringify(account));
    this.switchAccount(account[0]);
  }

  saveMasterSeed(seedBase58: string, key: string) {
    const encSeed = CryptoJS.AES.encrypt(seedBase58, key).toString();
    localStorage.setItem('ENC_MASTER_SEED', encSeed);
  }

  savePassphraseSeed(passphrase: string, key: string) {
    const encPassphraseSeed = CryptoJS.AES.encrypt(passphrase, key).toString();
    localStorage.setItem('ENC_PASSPHRASE_SEED', encPassphraseSeed);
  }
}
