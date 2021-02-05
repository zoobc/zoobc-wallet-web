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

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import zoobc, { AccountLedgerListParams, EventType, OrderBy, Address } from 'zbc-sdk';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
@Component({
  selector: 'app-node-reward-list',
  templateUrl: './node-reward-list.component.html',
})
export class NodeRewardListComponent implements OnInit {
  @ViewChild('rewardlist') rewardList: ElementRef;

  account: SavedAccount;
  accParams: Address;
  isLoading: boolean = false;
  isError: boolean = false;
  finished: boolean = false;
  showAutomaticNumber: boolean = true;
  // address: string = this.authServ.getCurrAccount().address.address;
  page: number = 1;
  perPage: number = 10;
  total: number = 0;

  displayedColumns = [
    {
      id: 'balanceChange',
      format: 'money',
      caption: 'reward',
      width: 40,
    },
    {
      id: 'blockHeight',
      format: 'number',
      caption: 'height',
      width: 15,
    },
    {
      id: 'timestamp',
      format: 'timestamp',
      caption: 'timestamp',
      width: 30,
      align: 'right',
    },
  ];
  tableData = [];

  constructor(private authServ: AuthService, private element: ElementRef) {
    this.account = authServ.getCurrAccount();
    this.accParams = this.account.address;
  }

  ngOnInit() {
    this.getRewardsNode(true);
  }

  async getRewardsNode(reload: boolean = false) {
    this.perPage = Math.floor(this.rewardList.nativeElement.clientHeight / 50);
    this.isLoading = true;
    this.isError = false;
    if (reload) {
      this.tableData = undefined;
      this.page = 1;
    }

    const param: AccountLedgerListParams = {
      address: this.accParams,
      eventType: EventType.EVENTREWARD,
      pagination: {
        page: this.page,
        limit: this.perPage,
        orderField: 'timestamp',
        orderBy: OrderBy.DESC,
      },
    };

    try {
      const ledgerList = await zoobc.AccountLedger.getList(param);
      this.total = ledgerList.total;
      this.tableData = reload
        ? ledgerList.accountLedgerList
        : this.tableData.concat(ledgerList.accountLedgerList);
    } catch (err) {
      this.isError = true;
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }

  onLoadMore() {
    if (this.tableData && this.tableData.length < this.total) {
      this.page++;
      this.getRewardsNode();
    } else this.finished = true;
  }
}
