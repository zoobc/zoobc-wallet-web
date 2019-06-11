import { Component, OnInit } from "@angular/core";

import { AccountService } from "../../services/account.service";
import { AppService } from "../../app.service";

@Component({
  selector: "app-transferhistory",
  templateUrl: "./transferhistory.component.html",
  styleUrls: ["./transferhistory.component.scss"]
})
export class TransferhistoryComponent implements OnInit {
  accountHistory: any = []
  pubKey: string
  config: any;

  constructor(
    private accountService: AccountService,
    private appServ: AppService
  ) {
    this.appServ.currAccount.subscribe(res => {
      this.pubKey = res
    })
    
    this.accountService.getAccountTransaction().then((res: any) => {
      this.accountHistory = res.transactionsList;
      console.log(this.accountHistory);
    });
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.accountHistory.length
    };
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  ngOnInit() {}
}
