import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  largeScreen = window.innerWidth >= 576 ? true : false;
  showSubPage: boolean;

  routerEvent: Subscription;
  menu: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    window.onresize = () => {
      this.largeScreen = window.innerWidth >= 576 ? true : false;
    };

    this.routerEvent = this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        if (this.route.snapshot.firstChild.url.length > 0) {
          this.showSubPage = true;
        } else {
          this.showSubPage = false;
        }
      }
    });
  }

  ngOnInit() {}
}
