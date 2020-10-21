import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'zoobc-wallet-web';
  constructor(private langServ: LanguageService, authServ: AuthService) {
    this.langServ.setInitialAppLanguage();
    authServ.login('111111')
  }
}
