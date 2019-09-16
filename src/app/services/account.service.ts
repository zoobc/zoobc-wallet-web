import { Injectable } from '@angular/core';

import { AccountBalanceService } from '../grpc/service/accountBalance_pb_service';
import {
  GetAccountBalanceRequest,
  GetAccountBalanceResponse,
} from '../grpc/model/accountBalance_pb';
import { environment } from '../../environments/environment';
import { AuthService, SavedAccount } from './auth.service';
import { grpc } from '@improbable-eng/grpc-web';
import { GetAddressFromPublicKey } from 'src/helpers/utils';
import { KeyringService } from './keyring.service';
import { TransactionService, Transactions } from './transaction.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private transactionServ: TransactionService
  ) {}

  getAccountBalance(address: string = this.authServ.currAddress) {
    // const address = this.authServ.currAddress;
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
          if (code == grpc.Code.Unknown) {
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

  getAllAccount() {
    let accounts: any[] = JSON.parse(localStorage.getItem('ACCOUNT')) || [];
    accounts.map(async acc => {
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(
        'ZBC',
        acc.path
      );
      acc.address = GetAddressFromPublicKey(childSeed.publicKey);
      await this.transactionServ
        .getAccountTransaction(acc.address, 1, 1)
        .then((res: Transactions) => {
          acc.lastTx = res.transactions;
        });
      await this.getAccountBalance(acc.address).then((res: any) => {
        acc.balance = res.accountbalance.spendablebalance;
      });
      return acc;
    });

    return accounts;
  }
}
