import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs/internal/Subscription';
import { RevealPassphraseComponent } from '../reveal-passphrase/reveal-passphrase.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

  isLoggedIn: boolean = false;

  account: SavedAccount;
  node: string = '';

  routerEvent: Subscription;

  constructor(
    private authServ: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private appServ: AppService
  ) {
    this.routerEvent = this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        this.isLoggedIn = this.authServ.isLoggedIn() ? true : false;
        this.account = authServ.getCurrAccount();
        this.node = this.account ? this.account.nodeIP : null;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }

  onToggle() {
    this.appServ.toggle();
  }

  onOpenRevealPassphrase() {
    this.dialog.open(RevealPassphraseComponent, {
      width: '420px',
    });
  }

  async onComingSoonPage() {
    let message: string = 'Coming Soon';
    Swal.fire({
      type: 'info',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  async onLogout() {
    let message: string = 'Are you sure want to logout?';
    Swal.fire({
      title: message,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.authServ.logout();
        this.router.navigateByUrl('/');
        return true;
      },
    });
  }
}
