import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sell-zbc',
  templateUrl: './sell-zbc.component.html',
  styleUrls: ['./sell-zbc.component.scss'],
})
export class SellZbcComponent implements OnInit {
  minDate = new Date();
  maxDate = new Date();
  constructor() {
    this.maxDate.setDate(this.maxDate.getDate() + 10);
  }

  ngOnInit() {}

  onSelect(account) {

  }
}
