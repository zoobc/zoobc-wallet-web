import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent implements OnInit {
  largeScreen = window.innerWidth >= 500 ? true : false;
  routerEvent: any;
  menu: string = '';

  isLogin: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appServ: AppService
  ) {
    window.onresize = () => {
      this.largeScreen = window.innerWidth >= 500 ? true : false;
    };

    this.routerEvent = this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        this.menu = this.route.snapshot.firstChild.url[0].path;
      }
    });

    this.isLogin = this.appServ.isLoggedIn();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }
}
