import { Component, OnInit } from '@angular/core';
import { NodeList, Node } from '../../../helpers/node-list';

@Component({
  selector: 'network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
})
export class NetworkComponent implements OnInit {
  nodeList: NodeList;
  selectedNode: Node;
  constructor() {}

  ngOnInit() {
    this.nodeList = JSON.parse(localStorage.getItem('NODE_LIST'));
    this.selectedNode = JSON.parse(localStorage.getItem('SELECTED_NODE'));
  }

  changeNode(ip: string) {
    const node = this.nodeList.node.find(node => node.ip == ip);
    localStorage.setItem('SELECTED_NODE', JSON.stringify(node));
  }

  edit(e) {
    e.stopPropagation();
  }
}
