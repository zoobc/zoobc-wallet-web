import { Component, OnInit } from "@angular/core";

import { TransactionService } from '../../services/transaction.service';
import { AppService } from "../../app.service";

@Component({
  selector: "app-transferhistory",
  templateUrl: "./transferhistory.component.html",
  styleUrls: ["./transferhistory.component.scss"]
})
export class TransferhistoryComponent implements OnInit {
  accountHistory: any = []
  address: string
  config: any;

  constructor(
    private appServ: AppService,
    private transactionServ: TransactionService
  ) {
    this.address = this.appServ.getAddress()

    this.transactionServ.getAccountTransaction().then((res: any) => {
      this.accountHistory = res.transactionsList;
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
