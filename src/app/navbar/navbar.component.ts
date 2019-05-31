import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onToggleSidebar(e) {
    console.log(this.toggleSidebar);
    
    this.toggleSidebar.emit(e)
  }

}
