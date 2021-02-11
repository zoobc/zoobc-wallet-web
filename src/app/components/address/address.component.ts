import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { onCopyText } from 'src/helpers/utils';
import { MatSnackBar } from '@angular/material';
import { isZBCAddressValid, shortenHash } from 'zbc-sdk';

@Component({
  selector: 'wallet-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnChanges {
  @Input() value: string;
  @Input() copyButton: boolean = true;
  @Input() center: boolean = false;
  @Input() showFull = false;

  len: number = 0;
  halfLen: number = 0;
  shortValue: string;

  constructor(private snackbar: MatSnackBar) {}

  ngOnChanges(changes: SimpleChanges): void {
    const value = changes.value.currentValue;
    if (value) {
      this.shortValue = isZBCAddressValid(value) ? shortenHash(value) : value;
      this.len = this.shortValue.length;
      this.halfLen = Math.round(this.shortValue.length / 2);
    }
  }

  async onCopyText(e) {
    e.stopPropagation();
    e.preventDefault();
    onCopyText(this.value);

    let message: string = 'Address copied to clipboard';
    this.snackbar.open(message, null, { duration: 3000 });
  }
}
