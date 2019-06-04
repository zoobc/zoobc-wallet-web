import { Component, OnInit } from '@angular/core';

import { AccountService } from "../../services/account.service"

@Component({
  selector: 'app-transferhistory',
  templateUrl: './transferhistory.component.html',
  styleUrls: ['./transferhistory.component.scss']
})
export class TransferhistoryComponent implements OnInit {
  accountHistory;
  config: any;
  constructor(private accountService: AccountService) {
    this.accountHistory = this.accountService.getAccountTransaction();
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.accountHistory.count
    };
   }
   
   pageChanged(event){
    this.config.currentPage = event;
  }

  ngOnInit() {
  }

}
