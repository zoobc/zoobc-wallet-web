// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

//     2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
// contact us at roberto.capodieci[at]blockchainzoo.com
// and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { MatSidenav, MatDrawerContent } from '@angular/material';
import { ExtendedScrollToOptions } from '@angular/cdk/scrolling';
import nodeListJson from 'src/assets/node-list/node-list.json';
import { NodeList } from 'src/helpers/node-list';
import zoobc, { GroupData, HostInterface } from 'zbc-sdk';
import { MultiSigDraft } from 'src/app/services/multisig.service';

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
    // let nodeList: NodeList = nodeListJson;
    // let currNodeList: NodeList = JSON.parse(localStorage.getItem('NODE_LIST'));

    // if there's a new network on node-list.json
    // if (!currNodeList || currNodeList.timestamp < nodeList.timestamp) {
    //   localStorage.setItem('NODE_LIST', JSON.stringify(nodeList));
    //   localStorage.setItem('SELECTED_NODE', '0');

    //   currNodeList = JSON.parse(localStorage.getItem('NODE_LIST'));
    // }

    // const list: HostInterface[] = currNodeList.node.map(node => {
    //   return {
    //     host: node.ip,
    //     name: node.name,
    //   };
    // });

    // zoobc.Network.list(list);
    // zoobc.Network.set(parseInt(localStorage.getItem('SELECTED_NODE')));

    const groups: GroupData[] = nodeListJson;
    zoobc.Network.load(groups);
  }
}
