import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RevealPassphraseComponent } from 'src/app/components/reveal-passphrase/reveal-passphrase.component';
import { LanguageService, LANGUAGES } from 'src/app/services/language.service';
import { getTranslation } from 'src/helpers/utils';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  activeLanguage = localStorage.getItem('SELECTED_LANGUAGE') || 'en';
  languages = LANGUAGES;

  constructor(
    private dialog: MatDialog,
    private langServ: LanguageService,
    private translate: TranslateService
  ) {}

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
    const sentence = getTranslation(
      'you will reset your setting and data. you will need to restore your recovery seed phrase. continue?',
      this.translate
    );
    const confirmButtonText = getTranslation('ok', this.translate);
    const cancelButtonText = getTranslation('cancel', this.translate);
    Swal.fire({
      text: sentence,
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    }).then(() => {
      localStorage.clear();
      window.location.reload();
    });
  }
}
