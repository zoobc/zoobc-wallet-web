import { Component, Input } from '@angular/core';
import { onCopyText, getTranslation } from 'src/helpers/utils';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { shortenHash } from 'zoobc-sdk';

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

  constructor(private snackbar: MatSnackBar, private translate: TranslateService) {
    if (this.value) {
      this.len = this.value.length;
      this.halfLen = Math.round(this.value.length / 2);

      this.shortValue = shortenHash(this.value);
    }
  }

  ngOnChanges() {
    if (this.value) {
      this.len = this.value.length;
      this.halfLen = Math.round(this.value.length / 2);

      this.shortValue = shortenHash(this.value);
    }
  }

  onCopyText(e) {
    e.stopPropagation();
    onCopyText(this.value);

    let message = getTranslation('successfully copied to clipboard', this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
  }
}
