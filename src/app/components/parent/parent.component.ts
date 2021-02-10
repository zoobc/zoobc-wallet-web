import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { MatSidenav, MatDrawerContent } from '@angular/material';
import { ExtendedScrollToOptions } from '@angular/cdk/scrolling';
import nodeListJson from '../../../assets/node-list.json';
import { NodeList } from '../../../helpers/node-list';
import zoobc, { HostInterface } from 'zbc-sdk';

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

  constructor(private router: Router, private route: ActivatedRoute, private appServ: AppService) {
    this.routerEvent = this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        this.menu = this.route.snapshot.firstChild.url[0].path;

        const opt: ExtendedScrollToOptions = { top: 0 };
        this.mainContainer.scrollTo(opt);
      }
    });

    this.isLogin = this.appServ.isLoggedIn();

    this.importNodeList();
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

  importNodeList() {
    let nodeList: NodeList = nodeListJson;
    let currNodeList: NodeList = JSON.parse(localStorage.getItem('NODE_LIST'));

    // if there's a new network on node-list.json
    if (!currNodeList || currNodeList.timestamp < nodeList.timestamp) {
      localStorage.setItem('NODE_LIST', JSON.stringify(nodeList));
      localStorage.setItem('SELECTED_NODE', '0');

      currNodeList = JSON.parse(localStorage.getItem('NODE_LIST'));
    }

    const list: HostInterface[] = currNodeList.node.map(node => {
      return {
        host: node.ip,
        name: node.name,
      };
    });

    zoobc.Network.list(list);
    zoobc.Network.set(parseInt(localStorage.getItem('SELECTED_NODE')));
  }
}
