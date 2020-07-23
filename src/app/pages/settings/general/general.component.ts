import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RevealPassphraseComponent } from 'src/app/components/reveal-passphrase/reveal-passphrase.component';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  onOpenRevealPassphrase() {
    this.dialog.open(RevealPassphraseComponent, {
      width: '420px',
    });
  }
}
