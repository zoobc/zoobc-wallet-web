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
}
