import { Injectable } from '@angular/core';
import { AuthService, SavedAccount } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NodeAdminService {
  constructor(private authServ: AuthService) {}

  addNodeAdmin(ip: string) {
    let account: SavedAccount = this.authServ.getCurrAccount();
    let accounts: SavedAccount[] = this.authServ.getAllAccount();

    account.nodeIP = ip;
    accounts = accounts.map((acc: SavedAccount) => {
      if (acc.path == account.path) acc = account;
      return acc;
    });

    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
    localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
  }

  editIpAddress(newIp: string) {
    let account = this.authServ.getCurrAccount();
    let accounts = this.authServ.getAllAccount();

    account.nodeIP = newIp;
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].path == account.path) accounts[i] = account;
    }

    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
    localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
  }
}
