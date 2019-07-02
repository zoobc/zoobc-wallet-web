import { Injectable } from '@angular/core';

import { AccountBalancesServiceClient } from '../grpc/service/accountBalanceServiceClientPb';
import {
  GetAccountBalanceRequest,
  AccountBalance,
} from '../grpc/model/accountBalance_pb';

import { environment } from '../../environments/environment';
import { AppService, SavedAccount } from '../app.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  accBalanceServ: AccountBalancesServiceClient;
  accounts: [] = JSON.parse(localStorage.getItem('accounts')) || [];

  constructor(private appServ: AppService) {
    this.accBalanceServ = new AccountBalancesServiceClient(
      environment.grpcUrl,
      null,
      null
    );
  }

  generateDerivationPath(): string {
    const accounts: [SavedAccount] =
      JSON.parse(localStorage.getItem('accounts')) || [];
    // filter only not imported account
    const filterAcc = accounts.filter(acc => !acc.imported);

    // find total of not imported account. the result is the derivation path
    const sizeAcc = filterAcc.length;
    return `m/44'/148'/0'/0/${sizeAcc}`;
  }

  getAccountBalance() {
    let publicKey = this.appServ.currPublicKey;
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();
      request.setPublickey(publicKey);

      this.accBalanceServ.getAccountBalance(
        request,
        null,
        (err, response: AccountBalance) => {
          if (err) return reject(err);
          resolve(response.toObject());
        }
      );
    });
  }
}
