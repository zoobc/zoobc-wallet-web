import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wallet-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  @Input() value: string;
  constructor() {}

  ngOnInit() {}
}
