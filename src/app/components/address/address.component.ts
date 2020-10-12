import { Component, Input, SimpleChanges } from '@angular/core';
import { onCopyText, getTranslation } from 'src/helpers/utils';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { isZBCAddressValid, shortenHash } from 'zoobc-sdk';

@Component({
  selector: 'wallet-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent {
  @Input() value: string;
  @Input() copyButton: boolean = true;
  @Input() center: boolean = false;

  shortValue: string;
  len: number = 0;
  halfLen: number = 0;

  // constructor(private snackbar: MatSnackBar, private translate: TranslateService) {
  // if (this.value) {
  //   this.len = this.value.length;
  //   this.halfLen = Math.round(this.value.length / 2);
  //   this.shortValue = shortenHash(this.value);
  // }
  // }

  // ngOnChanges() {
  //   if (this.value) {
  //     this.shortValue = isZBCAddressValid(this.value) ? shortenHash(this.value) : this.value;
  //     this.len = this.shortValue.length;
  //     this.halfLen = Math.round(this.shortValue.length / 2);
  //   }
  // }
  constructor(private snackbar: MatSnackBar, private translate: TranslateService) {}

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

  onCopyText(e) {
    e.stopPropagation();
    onCopyText(this.value);

    let message = getTranslation('successfully copied to clipboard', this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
  }
}
