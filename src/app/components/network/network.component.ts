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

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NodeList, Node } from '../../../helpers/node-list';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import zoobc, { HostInterface } from 'zbc-sdk';

@Component({
  selector: 'network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
})
export class NetworkComponent implements OnInit {
  @ViewChild('detailDialog') detailDialog: TemplateRef<any>;
  detailRefDialog: MatDialogRef<any>;

  nodeList: NodeList;
  selectedNode: number;

  currAction: string = 'add';

  formNetwork: FormGroup;
  nameField = new FormControl('', [Validators.required]);
  ipField = new FormControl('', [Validators.required, Validators.pattern('^https?://+[\\w.-]+:\\d+$')]);

  constructor(private dialog: MatDialog) {
    this.formNetwork = new FormGroup({
      name: this.nameField,
      ip: this.ipField,
    });
  }

  ngOnInit() {
    this.nodeList = JSON.parse(localStorage.getItem('NODE_LIST'));
    this.selectedNode = parseInt(JSON.parse(localStorage.getItem('SELECTED_NODE')));
  }

  changeNode(idx: number) {
    localStorage.setItem('SELECTED_NODE', idx.toString());
    // zoobc.Network.set(idx);
    this.selectedNode = idx;
  }

  openDialog(e, action, node?: Node, idx?: number) {
    e.stopPropagation();
    this.detailRefDialog = this.dialog.open(this.detailDialog, {
      width: '360px',
      maxHeight: '90vh',
    });

    this.currAction = action;
    if (action == 'add') {
      this.nameField.patchValue('');
      this.ipField.patchValue('');
    } else if (action == 'edit') {
      this.nameField.patchValue(node.name);
      this.ipField.patchValue(node.ip);
    }

    this.detailRefDialog.afterClosed().subscribe((node: Node) => {
      if (node) {
        if (action == 'add') this.nodeList.node.push(node);
        else if (action == 'edit') this.nodeList.node[idx] = node;
        localStorage.setItem('NODE_LIST', JSON.stringify(this.nodeList));

        this.updateHost();
      }
    });
  }

  submitNetwork() {
    if (this.formNetwork.valid) {
      const node: Node = {
        name: this.nameField.value,
        ip: this.ipField.value,
        default: false,
      };

      this.detailRefDialog.close(node);
    }
  }

  delete(e, idx: number) {
    e.stopPropagation();
    this.nodeList.node.splice(idx, 1);
    localStorage.setItem('NODE_LIST', JSON.stringify(this.nodeList));

    this.updateHost();

    // if current index network bigger than users index of removed network
    // host length will be minus by one so it can be out of index error
    if (this.selectedNode >= idx) {
      this.selectedNode--;
      this.changeNode(this.selectedNode);
    }
  }

  updateHost() {
    const list: HostInterface[] = this.nodeList.node.map(node => {
      return {
        host: node.ip,
        name: node.name,
      };
    });
    // zoobc.Network.list(list);
  }
}
