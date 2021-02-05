// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

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
  TransactionType,
} from 'zbc-sdk';
import { timer } from 'rxjs';
import { MultisigService } from 'src/app/services/multisig.service';

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
    private translate: TranslateService,
    private multisigServ: MultisigService
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

  goToMultisig() {
    if (this.account.type == 'multisig')
      this.multisigServ.initDraft(this.account, TransactionType.SENDMONEYTRANSACTION);
    this.onToggle();
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
