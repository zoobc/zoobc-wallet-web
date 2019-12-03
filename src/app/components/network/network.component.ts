import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NodeList, Node } from '../../../helpers/node-list';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
})
export class NetworkComponent implements OnInit {
  @ViewChild('detailDialog') detailDialog: TemplateRef<any>;
  detailRefDialog: MatDialogRef<any>;

  nodeList: NodeList;
  selectedNode: Node;

  currAction: string = 'add';

  formNetwork: FormGroup;
  nameField = new FormControl('', [Validators.required]);
  ipField = new FormControl('', [
    Validators.required,
    Validators.pattern('^[\\w.-]+:\\d+$'),
  ]);

  constructor(private dialog: MatDialog) {
    this.formNetwork = new FormGroup({
      name: this.nameField,
      ip: this.ipField,
    });
  }

  ngOnInit() {
    this.nodeList = JSON.parse(localStorage.getItem('NODE_LIST'));
    this.selectedNode = JSON.parse(localStorage.getItem('SELECTED_NODE'));
  }

  changeNode(ip: string) {
    const node = this.nodeList.node.find(node => node.ip == ip);
    localStorage.setItem('SELECTED_NODE', JSON.stringify(node));
  }

  openDialog(e, action, node?: Node, idx?: number) {
    e.stopPropagation();
    this.detailRefDialog = this.dialog.open(this.detailDialog, {
      width: '360px',
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
      }
    });
  }

  submitNetwork() {
    const node: Node = {
      name: this.nameField.value,
      ip: this.ipField.value,
      default: false,
    };

    this.detailRefDialog.close(node);
  }

  delete(e, idx: number) {
    e.stopPropagation();
    this.nodeList.node.splice(idx, 1);
    localStorage.setItem('NODE_LIST', JSON.stringify(this.nodeList));
  }
}
