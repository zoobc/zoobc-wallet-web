import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageService } from 'src/app/services/language.service';
import { AppService, LANGUAGES, SavedAccount } from 'src/app/app.service';
import {
  currency,
  CurrencyRateService,
} from 'src/app/services/currency-rate.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();
  @Input() isActive: string;

  private languages = [];
  private activeLanguage = 'en';

  currencyRates: currency[];
  zbcPriceInUsd: number = 10;

  currencyRate: currency;

  accounts: [SavedAccount];
  currAcc: SavedAccount;

  constructor(
    private langServ: LanguageService,
    private appServ: AppService,
    private router: Router,
    private currencyServ: CurrencyRateService
  ) {}

  ngOnInit() {
    this.languages = LANGUAGES;
    this.activeLanguage = localStorage.getItem('SELECTED_LANGUAGE') || 'en';
    this.getCurrencyRates();
    this.accounts = this.appServ.getAllAccount();
    this.currAcc = this.appServ.getCurrAccount();

    this.currencyRate = this.currencyServ.rate;
    console.log(this.currencyRate);
  }

  onToggleSidebar(e) {
    this.toggleSidebar.emit(e);
  }

  onSwitchAccount(account: SavedAccount) {
    this.appServ.changeCurrentAccount(account);
    this.currAcc = this.appServ.getCurrAccount();
    this.router.navigateByUrl('/');
  }

  getCurrencyRates() {
    this.currencyServ.getCurrencyRate().subscribe((res: any) => {
      let rates = Object.keys(res.rates).map(currencyName => {
        let rate = {
          name: currencyName,
          value: res.rates[currencyName] * this.zbcPriceInUsd,
        };
        if (this.currencyRate.name == currencyName)
          this.currencyRate.value = rate.value;
        return rate;
      });
      rates.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
      });

      this.currencyRates = rates;
    });
  }

  selectActiveLanguage() {
    this.langServ.setLanguage(this.activeLanguage);
  }

  onChangeRate(rate) {
    this.currencyServ.onChangeRate(rate);
    this.currencyRate = rate;
  }
}
