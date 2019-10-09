import { Injectable } from '@angular/core';

import { AccountBalanceService } from '../grpc/service/accountBalance_pb_service';
import {
  GetAccountBalanceRequest,
  GetAccountBalanceResponse,
} from '../grpc/model/accountBalance_pb';
import { environment } from '../../environments/environment';
import { grpc } from '@improbable-eng/grpc-web';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor() {}

  getAccountBalance(address: string) {
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();
      request.setAccountaddress(address);
      grpc.invoke(AccountBalanceService.GetAccountBalance, {
        request: request,
        host: environment.grpcUrl,
        onMessage: (message: GetAccountBalanceResponse) => {
          resolve(message.toObject());
        },
        onEnd: (
          code: grpc.Code,
          msg: string | undefined,
          trailers: grpc.Metadata
        ) => {
          if (code == grpc.Code.NotFound) {
            const firstValue = {
              accountbalance: {
                spendablebalance: 0,
                balance: 0,
              },
            };
            return resolve(firstValue);
          } else if (code != grpc.Code.OK) reject(msg);
        },
      });
    });
  }
}
