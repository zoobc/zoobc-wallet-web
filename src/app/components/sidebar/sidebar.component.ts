import { Component, Input } from '@angular/core';
import { ReceiveComponent } from 'src/app/pages/receive/receive.component';
import { MatDialog } from '@angular/material';
import { AppService } from 'src/app/app.service';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router, NavigationEnd } from '@angular/router';
import { getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() menu: string;
  show:boolean = false;

  routerEvent: Subscription;
  account: SavedAccount;

  constructor(
    private dialog: MatDialog,
    private appServ: AppService,
    private router: Router,
    authServ: AuthService,
    private translate: TranslateService,
  ) {
    authServ.currAccount.subscribe(account => (this.account = account));

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

  onToggleSubMenu() {
    this.appServ.toggle();
    this.show = false;
  }

  onClick() {
    this.show = !this.show;
  }

  openReceiveForm() {
    this.dialog.open(ReceiveComponent, {
      width: '480px',
    });
  }

  async onComingSoonPage() {
    let message = getTranslation('coming soon', this.translate);
    Swal.fire({
      type: 'info',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
