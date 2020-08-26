import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RevealPassphraseComponent } from 'src/app/components/reveal-passphrase/reveal-passphrase.component';
import { LanguageService, LANGUAGES } from 'src/app/services/language.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  activeLanguage = localStorage.getItem('SELECTED_LANGUAGE') || 'en';
  languages = LANGUAGES;

  constructor(private dialog: MatDialog, private langServ: LanguageService) {}

  ngOnInit() {}

  onOpenRevealPassphrase() {
    this.dialog.open(RevealPassphraseComponent, {
      width: '420px',
      maxHeight: '90vh',
    });
  }

  changeLanguage(lang: string) {
    this.langServ.setLanguage(lang);
    this.activeLanguage = lang;
  }

  resetData() {
    const sentence =
      'You will reset your setting and data. You will need to restore your recovery seed phrase. Continue?';
    Swal.fire({ text: sentence, showCancelButton: true }).then(() => {
      localStorage.clear();
      window.location.reload();
    });
  }
}
