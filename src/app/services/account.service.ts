import { Injectable } from '@angular/core';

import { AccountBalanceServiceClient } from '../grpc/service/accountBalanceServiceClientPb';
import {
  GetAccountBalanceRequest,
  GetAccountBalanceResponse,
} from '../grpc/model/accountBalance_pb';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private accBalanceServ: AccountBalanceServiceClient;

  constructor(private authServ: AuthService) {
    this.accBalanceServ = new AccountBalanceServiceClient(
      environment.grpcUrl,
      null,
      null
    );
  }

  getAccountBalance() {
    const address = this.authServ.currAddress;
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();

      request.setAccountaddress(address);

      this.accBalanceServ.getAccountBalance(
        request,
        null,
        (err, response: GetAccountBalanceResponse) => {
          if (err) {
            if (err.code != 2) return reject(err);
            // if (err) return reject(err);

            if (err.code == 2) {
              const firstValue = {
                accountbalance: {
                  spendablebalance: 0,
                  balance: 0,
                },
              };
              return resolve(firstValue);
            }
          }

          resolve(response.toObject());
        }
      );
    });
  }
}
