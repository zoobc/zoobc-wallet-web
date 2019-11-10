import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sell-zbc',
  templateUrl: './sell-zbc.component.html',
  styleUrls: ['./sell-zbc.component.scss'],
})
export class SellZbcComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  onSelect(account) {
    console.log(account);
  }
}
