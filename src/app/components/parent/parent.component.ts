import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-parent",
  templateUrl: "./parent.component.html",
  styleUrls: ["./parent.component.scss"]
})
export class ParentComponent implements OnInit {
  isSidebarOpen = false;
  routerEvent: any;
  menu: string = "";

  constructor(private router: Router, private route: ActivatedRoute) {
    this.routerEvent = this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        this.menu = this.route.snapshot.firstChild.url[0].path;
      }
    });
  }

  ngOnInit() {}

  toggleSidebar() {
    console.log(this.isSidebarOpen);
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
