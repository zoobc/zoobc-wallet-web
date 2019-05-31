import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {

  isSidebarOpen = false
  constructor() { }

  ngOnInit() {
  }

  toggleSidebar(e) {
    console.log(this.isSidebarOpen);
    this.isSidebarOpen = !this.isSidebarOpen
  }

}
