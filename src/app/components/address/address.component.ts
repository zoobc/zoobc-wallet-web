import { Component, OnInit, Input } from '@angular/core';
import { onCopyText, getTranslation } from 'src/helpers/utils';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wallet-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  @Input() value: string;
  @Input() copyButton: boolean = false;
  @Input() center: boolean = false;
  constructor(private snackbar: MatSnackBar, private translate: TranslateService) {}

  ngOnInit() {}

  async onCopyText(e) {
    e.stopPropagation();
    onCopyText(this.value);

    let message = await getTranslation('Address copied to clipboard', this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
  }
}
