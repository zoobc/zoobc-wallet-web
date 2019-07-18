import { TranslateService } from "@ngx-translate/core";
import { Injectable } from "@angular/core";

import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import localeIdExtra from '@angular/common/locales/extra/id';
import localeEn from '@angular/common/locales/en';

@Injectable({
  providedIn: "root"
})
export class LanguageService {
  selected = ""

  constructor(
    private translate: TranslateService,
  ) { }

  setInitialAppLanguage() {
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    const lang = localStorage.getItem("SELECTED_LANGUAGE") || 'en'
    this.setLanguage(lang)

    switch (lang) {
      case 'id':
        registerLocaleData(localeId, 'id');
      case 'en':
        registerLocaleData(localeEn, 'en');
    }
  }
  setLanguage(lng) {
    this.translate.use(lng);
    this.selected = lng;
    localStorage.setItem("SELECTED_LANGUAGE", lng);
  }
}