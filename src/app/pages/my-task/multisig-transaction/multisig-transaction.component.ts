import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-multisig-transaction',
  templateUrl: './multisig-transaction.component.html',
  styleUrls: ['./multisig-transaction.component.scss'],
})
export class MultisigTransactionComponent {
  @Input() pendingListMultiSig;
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  @Output() txHash: EventEmitter<string> = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  onRefresh() {
    this.refresh.emit(true);
  }

  openDetailMultiSignature(txHash: string) {
    this.txHash.emit(txHash);
  }
}
