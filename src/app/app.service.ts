import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatSidenav } from '@angular/material';

@Injectable({
  providedIn: 'root',
})
export class AppService implements CanActivate {
  private sidenav: MatSidenav;

  constructor(private router: Router, private authServ: AuthService) {}

  isLoggedIn(): boolean {
    return this.authServ.isLoggedIn() ? true : false;
  }

  canActivate(): boolean {
    if (this.authServ.isLoggedIn()) return true;

    this.router.navigateByUrl(`/login?redirect=${window.location.pathname}`);
    // this.router.navigateByUrl(`/login`);
    return false;
  }

  // SIDENAV FUNCTION
  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }
  public toggle() {
    if (!this.sidenav.disableClose) this.sidenav.toggle();
  }
}
