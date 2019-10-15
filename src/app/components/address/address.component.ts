import { Component, OnInit, Input } from '@angular/core';
import { onCopyText } from 'src/helpers/utils';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'wallet-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  @Input() value: string;
  @Input() copyButton: boolean = false;
  @Input() center: boolean = false;
  constructor(private snackbar: MatSnackBar) {}

  ngOnInit() {}

  onCopyText(e) {
    e.stopPropagation();
    onCopyText(this.value);
    this.snackbar.open('Copied to clipboard', null, { duration: 3000 });
  }
}
