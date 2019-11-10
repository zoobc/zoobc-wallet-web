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
  routerEvent: any;
  menu: string = '';

  isLogin: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appServ: AppService // private keyringServ: KeyringService, // private authServ: AuthService
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
    // const seed =
    //   'c0a6e8e22681e240fb6af88a03ed9b9cfab7d35145f59ce1e578d214e863820e44b0c12e3688129f7235ea6972b1ef6f381756517c6703802e74479a1ea5e7f6';
    // this.keyringServ.calcBip32RootKeyFromSeed('ZBC', Buffer.from(seed, 'hex'));
  }

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }
}
