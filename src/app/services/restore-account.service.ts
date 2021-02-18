import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import zoobc, { getZBCAddress, TransactionListParams, ZBCTransactions } from 'zbc-sdk';
import { AuthService, SavedAccount } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RestoreAccountService {
  private restoring = false;

  constructor(private authServ: AuthService) {}

  async restoreAccounts() {
    const isRestored: boolean = localStorage.getItem('IS_RESTORED') === 'true';
    if (!isRestored && !this.restoring) {
      this.restoring = true;
      const keyring = this.authServ.keyring;

      let accountPath: number = 1;
      let accountsTemp = [];
      let accounts = this.authServ.getAllAccount();
      let counter: number = 0;

      while (counter < 20) {
        const childSeed = keyring.calcDerivationPath(accountPath);
        const address = getZBCAddress(childSeed.publicKey);

        const account: SavedAccount = {
          name: 'Account '.concat((accountPath + 1).toString()),
          path: accountPath,
          nodeIP: null,
          address: { value: address, type: 0 },
          type: 'normal',
        };
        const params: TransactionListParams = {
          address: { value: address, type: 0 },
          transactionType: 1,
          pagination: {
            page: 1,
            limit: 1,
          },
        };
        await zoobc.Transactions.getList(params).then((res: ZBCTransactions) => {
          const totalTx = res.total;
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

      // checking if there's a new account created by user during this process
      const oldAccounts = this.authServ.getAllAccount();
      for (let i = 1; i < oldAccounts.length; i++) {
        const account = oldAccounts[i];
        let isDuplicate = false;
        for (let j = 0; j < accounts.length; j++) {
          const account2 = accounts[j];
          if (account.address.value == account2.address.value) {
            isDuplicate = true;
            break;
          }
        }

        // if the account created by user isnt in accounts list generated by this process, push it to the array
        if (!isDuplicate) accounts.push(account);
      }

      const net = environment.production ? 'MAIN' : 'TEST';
      localStorage.setItem(`ACCOUNT_${net}`, JSON.stringify(accounts));
      localStorage.setItem('IS_RESTORED', 'true');

      this.restoring = false;
    }
  }
}
