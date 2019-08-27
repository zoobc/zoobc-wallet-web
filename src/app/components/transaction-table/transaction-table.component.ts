import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
})
export class TransactionTableComponent implements OnInit {
  @Input() transactionData: [];
  @Input() isLoading: boolean = false;
  constructor() {}

  ngOnInit() {
    console.log(this.transactionData);
  }
}
