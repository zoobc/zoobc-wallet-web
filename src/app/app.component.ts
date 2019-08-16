import { Component } from '@angular/core';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'zoobc-wallet-web';
  constructor(private langServ: LanguageService) {
    this.langServ.setInitialAppLanguage();
  }
}
