import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { LANGUAGES } from "src/app/app.service";
import { LanguageService } from "src/app/services/language.service";
import { AppService } from "src/app/app.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();
  @Input() isActive: string;

  private languages = [];
  private activeLanguage = "en";

  currencyRates: { name: string; value: number }[];
  zbcPriceInUsd: number = 10;
  currPrice: number = 0;
  currRate: string = localStorage.getItem("rate") || "USD";
  accounts: [{ path: string; name: string }];
  currAcc: { path: string; name: string };

  constructor(
    private langServ: LanguageService,
    private appServ: AppService,
    private router: Router
  ) {}

  ngOnInit() {
    this.languages = LANGUAGES;
    this.activeLanguage = localStorage.getItem("SELECTED_LANGUAGE") || "en";
    this.getCurrencyRates();
    this.accounts = this.appServ.getAllAccount();
    this.currAcc = this.appServ.getCurrAccount();
  }

  onToggleSidebar(e) {
    this.toggleSidebar.emit(e);
  }

  onSwitchAccount(path) {
    this.appServ.changeCurrentAccount(path);
    this.currAcc = this.appServ.getCurrAccount();
    this.router.navigateByUrl("/");
  }

  getCurrencyRates() {
    this.appServ.getCurrencyRate().subscribe((res: any) => {
      let rates = Object.keys(res.rates).map(currencyName => {
        let rate = {
          name: currencyName,
          value: res.rates[currencyName] * this.zbcPriceInUsd
        };
        if (this.currRate == currencyName) this.currPrice = rate.value;
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
    localStorage.setItem("rate", rate.name);
    this.currRate = rate.name;
    this.currPrice = rate.value;
  }
}
