import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppService implements CanActivate {
  constructor(private router: Router, private authServ: AuthService) {}

  isLoggedIn() {
    return this.authServ.currPublicKey ? true : false;
  }

  canActivate(): boolean {
    if (this.authServ.currPublicKey) return true;

    this.router.navigateByUrl(`/login?redirect=${window.location.pathname}`);
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
  {
    country: 'Arabic',
    code: 'ar',
  },
];
