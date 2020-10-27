import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import zoobc, { AccountLedgerListParams, EventType, OrderBy } from 'zoobc-sdk';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Account } from 'zoobc-sdk/types/helper/interfaces';
@Component({
  selector: 'app-node-reward-list',
  templateUrl: './node-reward-list.component.html',
})
export class NodeRewardListComponent implements OnInit {
  @ViewChild('rewardlist') rewardList: ElementRef;

  account: SavedAccount;
  accParams: Account;
  isLoading: boolean = false;
  isError: boolean = false;
  finished: boolean = false;
  showAutomaticNumber: boolean = true;
  address: string = this.authServ.getCurrAccount().address;
  page: number = 1;
  perPage: number = 10;
  total: number = 0;

  displayedColumns = [
    {
      id: 'balancechange',
      format: 'money',
      caption: 'reward',
      width: 40,
    },
    {
      id: 'blockheight',
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
    this.accParams.address = this.account.address;
    this.accParams.type = 0;
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
      account: this.accParams,
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
