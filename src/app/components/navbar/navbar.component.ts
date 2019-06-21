import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LANGUAGES } from 'src/app/app.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private languages = []
  private activeLanguage = 'en'

  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();
  @Input() isActive: string;

  constructor(private langServ: LanguageService) { 
  }

  ngOnInit() {
    this.languages = LANGUAGES
    this.activeLanguage = localStorage.getItem("SELECTED_LANGUAGE")
  }

  onToggleSidebar(e) {
    console.log(this.toggleSidebar);
    
    this.toggleSidebar.emit(e)
  }

  selectActiveLanguage() {
    console.log("this.activeLanguage", this.activeLanguage)
    this.langServ.setLanguage(this.activeLanguage)
  }

}
