import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import zoobc, { AccountLedgerListParams, EventType, OrderBy } from 'zoobc-sdk';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
@Component({
  selector: 'app-node-reward-list',
  templateUrl: './node-reward-list.component.html',
})
export class NodeRewardListComponent implements OnInit {
  @ViewChild('rewardlist') rewardList: ElementRef;

  account: SavedAccount;
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
    },
    {
      id: 'blockheight',
      format: 'number',
      caption: 'height',
    },
    {
      id: 'timestamp',
      format: 'timestamp',
      caption: 'timestamp',
    },
  ];
  tableData = [];

  constructor(private authServ: AuthService, private element: ElementRef) {
    this.account = authServ.getCurrAccount();
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
      accountAddress: this.account.address,
      eventType: EventType.EVENTREWARD,
      pagination: {
        page: this.page,
        limit: this.perPage,
        orderBy: OrderBy.DESC,
      },
    };

    try {
      const ledgerList = await zoobc.AccountLedger.getList(param);
      this.total = parseInt(ledgerList.total);
      this.tableData = reload
        ? ledgerList.accountledgersList
        : this.tableData.concat(ledgerList.accountledgersList);
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
