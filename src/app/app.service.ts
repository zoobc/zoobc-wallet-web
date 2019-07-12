import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from './services/account.service';

@Injectable({
  providedIn: 'root',
})
export class AppService implements CanActivate {
  constructor(private router: Router, private accServ: AccountService) {}

  isLoggedIn() {
    return this.accServ.currPublicKey ? true : false;
  }

  canActivate(): boolean {
    if (this.accServ.currPublicKey) return true;
    this.router.navigateByUrl('/login');
    return false;
  }
}

// Language
export const LANGUAGES = [
  {
    country: 'English',
    code: 'en',
  },
  {
    country: 'Indonesia',
    code: 'id',
  },
];
