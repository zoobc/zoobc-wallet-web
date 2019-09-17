import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { MatSidenav, MatDrawerContent } from '@angular/material';
import { ExtendedScrollToOptions } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent implements OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  @ViewChild('mainContainer') private mainContainer: MatDrawerContent;
  largeScreen = window.innerWidth >= 576 ? true : false;
  routerEvent: any;
  menu: string = '';

  isLogin: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appServ: AppService
  ) {
    this.routerEvent = this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        this.menu = this.route.snapshot.firstChild.url[0].path;

        const opt: ExtendedScrollToOptions = { top: 0 };
        this.mainContainer.scrollTo(opt);
      }
    });

    this.isLogin = this.appServ.isLoggedIn();
  }

  @HostListener('window:resize', ['$event']) onResize(event) {
    this.largeScreen = event.target.innerWidth >= 576 ? true : false;
  }

  ngOnInit() {
    this.appServ.setSidenav(this.sidenav);
  }

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }
}
