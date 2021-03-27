// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

//     2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
// contact us at roberto.capodieci[at]blockchainzoo.com
// and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

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
  loginWithPinOrAddress = false;

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
      this.loginWithPinOrAddress = false;
      return (this.loggedIn = true);
    }
    return false;
  }

  loginWithoutPin(account: SavedAccount, seed?: BIP32Interface): boolean {
    if (!isZBCAddressValid(account.address.value)) return false;
    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
    this.loginWithPinOrAddress = true;
    this.sourceCurrAccount.next(account);

    if (seed) this._seed = seed;
    return (this.loggedIn = true);
  }

  logout() {
    this.loginWithPinOrAddress = false;
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
