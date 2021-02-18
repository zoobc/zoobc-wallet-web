import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { MatSidenav, MatDrawerContent } from '@angular/material';
import { ExtendedScrollToOptions } from '@angular/cdk/scrolling';
import nodeListJson from 'src/assets/node-list/node-list.json';
import { NodeList } from 'src/helpers/node-list';
import zoobc, { GroupData } from 'zbc-sdk';
import { MultiSigDraft } from 'src/app/services/multisig.service';

function equals(arr1, arr2) {
  return (
    Array.isArray(arr1) &&
    Array.isArray(arr2) &&
    arr1.length <= arr2.length &&
    arr1.every((val, idx) => val.label === arr2[idx].label)
  );
}

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

    const multisigList: MultiSigDraft[] = JSON.parse(localStorage.getItem('MULTISIG_DRAFTS')) || [];
    if (multisigList.length == 0) localStorage.setItem('MULTISIG_DRAFTS', '[]');
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
    /** get default value node list from json file and local storage  */
    let nodeList: NodeList[] = nodeListJson;
    let currNodeList: NodeList[] = JSON.parse(localStorage.getItem('NODE_LIST'));

    /** check and set local storage if current node list not available */
    if (!currNodeList) {
      localStorage.setItem('NODE_LIST', JSON.stringify(nodeList));
      currNodeList = JSON.parse(localStorage.getItem('NODE_LIST'));
    }

    /** update current node list (local storage) if having different from json file */
    if (!equals(nodeList, currNodeList)) {
      nodeList.forEach(item => {
        let idx = currNodeList.map(node => node.label).indexOf(item.label);
        if (idx !== undefined) currNodeList.splice(idx, 1, item);
      });

      localStorage.setItem('NODE_LIST', JSON.stringify(currNodeList));
    }

    /** filter node list who has selected is true */
    const groups: GroupData[] = currNodeList.filter(f => f.selected === true);
    zoobc.Network.load(groups);
  }
}
