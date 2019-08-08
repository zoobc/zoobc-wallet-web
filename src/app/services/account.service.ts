import { Injectable } from '@angular/core';

import { AccountBalancesServiceClient } from '../grpc/service/accountBalanceServiceClientPb';
import {
  GetAccountBalanceRequest,
  AccountBalance,
} from '../grpc/model/accountBalance_pb';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Account {
  balance: number;
  forgedbalance: number;
  height: number;
  id: number;
  publickey: string;
  unconfirmedbalance: number;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private accBalanceServ: AccountBalancesServiceClient;

  constructor(private authServ: AuthService) {
    this.accBalanceServ = new AccountBalancesServiceClient(
      environment.grpcUrl,
      null,
      null
    );
  }

  getAccountBalance() {
    let publicKey = this.authServ.currPublicKey;
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
