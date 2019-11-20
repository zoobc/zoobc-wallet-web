import { Injectable } from '@angular/core';

import { AccountBalanceService } from '../grpc/service/accountBalance_pb_service';
import {
  GetAccountBalanceRequest,
  GetAccountBalanceResponse,
} from '../grpc/model/accountBalance_pb';
import { grpc } from '@improbable-eng/grpc-web';
import { Node } from 'src/helpers/node-list';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor() {}

  getAccountBalance(address: string) {
    return new Promise((resolve, reject) => {
      const node: Node = JSON.parse(localStorage.getItem('SELECTED_NODE'));
      const request = new GetAccountBalanceRequest();

      request.setAccountaddress(address);
      grpc.invoke(AccountBalanceService.GetAccountBalance, {
        request: request,
        host: node.ip,
        onMessage: (message: GetAccountBalanceResponse) => {
          resolve(message.toObject());
        },
        onEnd: (
          code: grpc.Code,
          msg: string | undefined,
          trailers: grpc.Metadata
        ) => {
          if (code == grpc.Code.NotFound) {
            return resolve({
              accountbalance: {
                spendablebalance: 0,
                balance: 0,
              },
            });
          } else if (code != grpc.Code.OK) reject(msg);
        },
      });
    });
  }
}
