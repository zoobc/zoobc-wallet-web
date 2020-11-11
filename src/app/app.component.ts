import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'zoobc-wallet-web';
  constructor(private langServ: LanguageService, authSer: AuthService) {
    this.langServ.setInitialAppLanguage();
    authSer.login('111111');
  }
}
