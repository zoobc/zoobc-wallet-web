import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RevealPassphraseComponent } from 'src/app/components/reveal-passphrase/reveal-passphrase.component';
import Swal from 'sweetalert2';

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

  resetData() {
    const sentence =
      'You will reset your setting and data. You will need to restore your recovery seed phrase. Continue?';
    Swal.fire({ text: sentence, showCancelButton: true }).then(result => {
      if (result.value) {
        localStorage.clear();
        window.location.reload();
      }
    });
  }
}
