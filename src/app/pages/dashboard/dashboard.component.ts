import { Component, OnInit } from "@angular/core";
import { AccountService } from "../../services/account.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  accountBalance;

  accountBalanceServ: any
  getAccountBalanceReq: any

  constructor(
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.accountService.getAccountBalance().then(data => {
      this.accountBalance = data;
    });
    // this.accountService.getAccountBalance().subscribe(data => {
    //   this.accountBalance = data;
    // });
    window.scroll(0, 0);
  }
}
