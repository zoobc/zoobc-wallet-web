import { Component, OnInit, Input } from '@angular/core';
import { getZBCAddress } from 'zoobc-sdk';

@Component({
  selector: 'approval-escrow',
  templateUrl: './approval-escrow.component.html',
  styleUrls: ['./approval-escrow.component.scss'],
})
export class ApprovalEscrowComponent implements OnInit {
  @Input() transaction: any;
  constructor() {}

  ngOnInit() {
    this.transaction.timestamp = parseInt(this.transaction.timestamp) * 1000;
    this.transaction.transactionhash = getZBCAddress(Buffer.from(this.transaction.transactionhash, 'base64'));
  }

  getColorByEscrowStatus(status) {
    let color = '';
    if (status == '0') return (color = 'red');
    if (status == '1') return (color = 'green');
    return color;
  }

  getTextByEscrowStatus(status) {
    let text = '';
    switch (status) {
      case 0:
        text = 'rejected';
        break;
      case 1:
        text = 'approved';
        break;
      // case 2:
      //   text = 'rejected';
      //   break;
      // default:
      //   text = 'expired';
    }
    return text;
  }
}
