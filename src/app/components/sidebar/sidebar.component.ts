import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppService } from 'src/app/app.service';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router, NavigationEnd } from '@angular/router';
import { RevealPassphraseComponent } from '../reveal-passphrase/reveal-passphrase.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() menu: string;

  routerEvent: Subscription;
  account: SavedAccount;

  constructor(
    private dialog: MatDialog,
    private appServ: AppService,
    private router: Router,
    authServ: AuthService
  ) {
    this.account = authServ.getCurrAccount();

    this.routerEvent = this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        this.account = authServ.getCurrAccount();
      }
    });
  }

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }

  onToggle() {
    this.appServ.toggle();
  }

  openRevealPassphrase() {
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
}
