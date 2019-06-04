import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service'


@Injectable({
  providedIn: 'root'
})
export class AccountService {
AccountTransaction = [];
PublicKey : string = ''
  constructor(
    private http: HttpClient,
    private appServ: AppService
  ) {
    appServ.currAccount.subscribe(account => {
        this.PublicKey = account
      })
  }
  getAccountTransaction() {
    return this.http.get(`http://54.254.196.180:8000/getAccountTransactions/${this.PublicKey}`);
  }

}