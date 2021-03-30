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
import zoobc, { GroupData } from 'zbc-sdk';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
})
export class NetworkComponent implements OnInit {
  @ViewChild('detailDialog') detailDialog: TemplateRef<any>;
  detailRefDialog: MatDialogRef<any>;

  nodeList: NodeList[];
  selectedNode: number;
  idxNode: number;

  currAction: string = 'add';

  errorPattern: Boolean = false;
  enableSubmit: Boolean = false;

  formNetwork: FormGroup;
  labelField = new FormControl('', [Validators.required]);
  wkpsField = new FormControl('', [Validators.required]);
  regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  constructor(private dialog: MatDialog,
    private appService: AppService,
    private translate: TranslateService) {
    this.formNetwork = new FormGroup({
      label: this.labelField,
      wkps: this.wkpsField,
    });
  }

  ngOnInit() {
    const nodeList = JSON.parse(localStorage.getItem('NODE_LIST'));
    this.nodeList = nodeList;
    this.selectedNode = nodeList.map(i => i.selected).indexOf(true);

    this.formNetwork.get('wkps').valueChanges.subscribe(val => {
      const vals = val.split('\n');

      if (vals.length === 1 && vals[0] === '') {
        this.errorPattern = false;
        this.enableSubmit = false;
      }

      if (vals.length > 0 && vals[0] !== '') {
        vals.forEach((item: string) => {
          this.enableSubmit = false;
          this.errorPattern = true;

          if (this.regex.test(item)) {
            this.enableSubmit = true;
            this.errorPattern = false;
          }
        });
      }
    });
  }

  changeNode(selectedId: number) {
    const upNodeList = this.nodeList.map((item, idx) => {
      item.selected = idx === selectedId;
      return item;
    });

    localStorage.setItem('NODE_LIST', JSON.stringify(upNodeList));

    const groups: GroupData[] = [this.nodeList[selectedId]];
    zoobc.Network.load(groups);
    this.appService.netWorkEvent.next(selectedId);
  }

  openDialog(e, action, node?: Node, idx?: number) {
    e.stopPropagation();
    this.detailRefDialog = this.dialog.open(this.detailDialog, {
      width: '400px',
      maxHeight: '90vh',
    });

    this.idxNode = idx;
    this.currAction = action;

    if (action == 'add') {
      this.labelField.patchValue('');
      this.wkpsField.patchValue('');
    } else if (action == 'edit') {
      this.labelField.patchValue(node.label);
      this.wkpsField.patchValue(node.wkps.join('\n'));
    }
  }

  submitNetwork() {
    if (this.formNetwork.valid) {
      const node: Node = {
        label: this.labelField.value,
        wkps: this.wkpsField.value.split('\n'),
        default: false,
        selected: false,
      };

      if (this.currAction == 'add') this.nodeList.push(node);
      else if (this.currAction == 'edit') this.nodeList[this.idxNode] = node;

      localStorage.setItem('NODE_LIST', JSON.stringify(this.nodeList));

      const title = getTranslation(this.currAction == 'add' ? 'add network' : 'edit network', this.translate);
      const message = getTranslation(
        this.currAction == 'add' ? 'success insert new network' : 'success update existing network',
        this.translate
      );
      Swal.fire(title, message, 'success');
      this.detailRefDialog.close();
    }
  }

  delete(e, idx: number) {
    e.stopPropagation();

    const title = getTranslation('are you sure want to remove?', this.translate);
    const confirmButtonText = getTranslation('yes, delete it', this.translate);
    const cancelButtonText = getTranslation('no, keep it', this.translate);
    Swal.fire({ title, showCancelButton: true, confirmButtonText, cancelButtonText }).then(res => {
      if (res.value) {
        this.nodeList.splice(idx, 1);
        localStorage.setItem('NODE_LIST', JSON.stringify(this.nodeList));

        /**
         * if current index network bigger than users index of removed network
         * host length will be minus by one so it can be out of index error
         */
        if (this.selectedNode >= idx) {
          this.selectedNode--;
          this.changeNode(this.selectedNode);
        }

        const title = getTranslation('delete network', this.translate);
        const message = getTranslation('success deleted existing network', this.translate);
        Swal.fire(title, message, 'success');
      }
    });
  }
}
