import { Component, ViewChild, TemplateRef, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import { Address, ZBCTransaction } from 'zbc-sdk';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'send-money',
  templateUrl: './send-money.component.html',
})
export class SendMoneyComponent implements OnInit {
  @ViewChild('dialog') detailDialog: TemplateRef<any>;
  @Input() transaction: ZBCTransaction;

  address: Address;
  status: string = '';
  color: string = '';
  expUrl = environment.expUrl;

  currencyRate: Currency;

  constructor(private dialog: MatDialog, authServ: AuthService, private currencyServ: CurrencyRateService) {
    this.address = authServ.getCurrAccount().address;

    this.currencyServ.rate.subscribe(rate => (this.currencyRate = rate));
  }

  ngOnInit() {
    const approval = this.transaction.txBody.approval;
    this.color = approval == '0' ? 'yellow' : approval == '1' ? 'green' : approval == '2' ? 'red' : 'red';
    this.status =
      approval == '0' ? 'pending' : approval == '1' ? 'approved' : approval == '2' ? 'rejected' : 'expired';
  }

  openDetail(id) {
    this.dialog.open(this.detailDialog, {
      width: '500px',
      maxHeight: '90vh',
      data: id,
    });
  }
}
