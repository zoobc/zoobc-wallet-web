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

    for (let i = 0; i < accounts.length; i++) {
      const acc = accounts[i];
      if (acc.address.value == account.address.value) {
        account.nodeIP = accounts[i].nodeIP = ip;
        break;
      }
    }

    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
    localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
  }

  editIpAddress(newIp: string) {
    let account = this.authServ.getCurrAccount();
    let accounts = this.authServ.getAllAccount();

    for (let i = 0; i < accounts.length; i++) {
      const acc = accounts[i];
      if (acc.address == account.address) {
        account.nodeIP = accounts[i].nodeIP = newIp;
        break;
      }
    }

    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
    localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
  }
}
