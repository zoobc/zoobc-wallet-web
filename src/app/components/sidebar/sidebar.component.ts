import { Component, Input, OnInit } from '@angular/core';
import { ReceiveComponent } from 'src/app/pages/receive/receive.component';
import { MatDialog } from '@angular/material';
import { AppService } from 'src/app/app.service';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router, NavigationEnd } from '@angular/router';
import { getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import zoobc, {
  MultisigPendingListParams,
  PendingTransactionStatus,
  ZBCTransactions,
  EscrowListParams,
  EscrowStatus,
  Escrows,
} from 'zbc-sdk';
import { timer } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() menu: string;
  show: boolean = false;

  routerEvent: Subscription;
  account: SavedAccount;
  reloadingTimer: Subscription;

  taskCounter: number = 0;

  constructor(
    private dialog: MatDialog,
    private appServ: AppService,
    private router: Router,
    authServ: AuthService,
    private translate: TranslateService
  ) {
    authServ.currAccount.subscribe(account => (this.account = account));

    this.routerEvent = this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        this.account = authServ.getCurrAccount();
      }
    });
  }

  ngOnInit() {
    this.getTaskCounter();
  }

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
    this.reloadingTimer.unsubscribe();
  }

  onToggle() {
    this.appServ.toggle();
    this.show = false;
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

  getTaskCounter() {
    this.reloadingTimer = timer(0, 30 * 1000).subscribe(async () => {
      const params1: MultisigPendingListParams = {
        address: this.account.address,
        status: PendingTransactionStatus.PENDINGTRANSACTIONPENDING,
        pagination: {
          page: 1,
          limit: 1,
        },
      };
      const multisig = await zoobc.MultiSignature.getPendingList(params1).then(
        async (tx: ZBCTransactions) => tx.total
      );

      const params2: EscrowListParams = {
        approverAddress: this.account.address,
        statusList: [EscrowStatus.PENDING],
        pagination: {
          page: 1,
          limit: 1,
        },
        latest: true,
      };
      const escrow = await zoobc.Escrows.getList(params2).then(async (res: Escrows) => res.total);

      this.taskCounter = multisig + escrow;
    });
  }
}
