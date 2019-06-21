import { TranslateService } from "@ngx-translate/core";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class LanguageService {
  selected = ""

  constructor(
    private translate: TranslateService,
  ) {}

  setInitialAppLanguage() {
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    const active = localStorage.getItem("SELECTED_LANGUAGE")
    if(active){
        this.setLanguage(active)
    }
  }
  setLanguage(lng) {
    this.translate.use(lng);
    this.selected = lng;
    localStorage.setItem("SELECTED_LANGUAGE", lng);
  }
}