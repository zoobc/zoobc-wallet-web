import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { onCopyText } from 'src/helpers/utils';
import { MatSnackBar } from '@angular/material';
import { shortenHash } from 'zoobc-sdk';

@Component({
  selector: 'wallet-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnChanges {
  @Input() value: string;
  @Input() copyButton: boolean = true;
  @Input() center: boolean = false;

  len: number = 0;
  halfLen: number = 0;
  shortValue: string;

  constructor(private snackbar: MatSnackBar) {}

  ngOnChanges(changes: SimpleChanges): void {
    const value = changes.value.currentValue;

    if (value) {
      const prefixDefault = ['ZBC', 'ZNK', 'ZBL', 'ZTX'];
      const prefixValue = value.slice(0, 3);
      const valid = prefixDefault.indexOf(prefixValue) > -1;
      if (valid) {
        this.len = value.length;
        this.halfLen = Math.round(value.length / 2);
        this.shortValue = shortenHash(value);
      } else {
        this.len = value.length;
        this.halfLen = Math.round(value.length / 2);
        this.shortValue = value;
      }
    }
  }

  async onCopyText(e) {
    e.stopPropagation();
    onCopyText(this.value);

    let message: string = 'Address copied to clipboard';
    this.snackbar.open(message, null, { duration: 3000 });
  }
}
