import { Component } from '@angular/core';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'zoobc-wallet-web';
  constructor(private langServ: LanguageService) {
    this.langServ.setInitialAppLanguage();
  }
}
