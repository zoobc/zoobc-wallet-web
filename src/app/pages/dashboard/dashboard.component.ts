import { Component, OnInit } from "@angular/core";
import { GrpcapiService } from '../../services/grpcapi.service';

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
    private grpcapiService: GrpcapiService,
  ) { }

  ngOnInit() {
    this.grpcapiService.getAccountBalance().then(data => {
      this.accountBalance = data;
    });
    window.scroll(0, 0);
  }
}
