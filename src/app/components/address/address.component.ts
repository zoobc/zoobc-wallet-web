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
  @Input() showFull = false;

  shortValue: string;
  len: number = 0;
  halfLen: number = 0;

  constructor(private snackbar: MatSnackBar, private translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges) {
    const value = changes.value.currentValue;
    if (value) {
      this.shortValue = isZBCAddressValid(value) ? shortenHash(value) : value;
      this.len = this.shortValue.length;
      this.halfLen = Math.round(this.shortValue.length / 2);
    }
  }

  onCopyText(e) {
    e.stopPropagation();
    onCopyText(this.value);

    let message = getTranslation('successfully copied to clipboard', this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
  }
}
