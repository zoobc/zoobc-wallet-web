import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RevealPassphraseComponent } from 'src/app/components/reveal-passphrase/reveal-passphrase.component';
import { LanguageService, LANGUAGES } from 'src/app/services/language.service';

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
    });
  }

  changeLanguage(lang: string) {
    this.langServ.setLanguage(lang);
    this.activeLanguage = lang;
  }
}
