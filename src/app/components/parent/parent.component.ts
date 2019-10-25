import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { MatSidenav, MatDrawerContent } from '@angular/material';
import { ExtendedScrollToOptions } from '@angular/cdk/scrolling';
import { KeyringService } from 'src/app/services/keyring.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent implements OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  @ViewChild('mainContainer') private mainContainer: MatDrawerContent;
  largeScreen = window.innerWidth >= 576 ? true : false;
  height = window.innerHeight - 64;
  routerEvent: any;
  menu: string = '';

  isLogin: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appServ: AppService // private keyringServ: KeyringService,
  ) // private authServ: AuthService
  {
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
    this.height = window.innerHeight - 64;
  }

  ngOnInit() {
    this.appServ.setSidenav(this.sidenav);
    // const seed = this.authServ.currSeed;
    // this.keyringServ.calcBip32RootKeyFromSeed('ZBC', Buffer.from(seed, 'hex'));
  }

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }
}
