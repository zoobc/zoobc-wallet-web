import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NodeAdminService {
  constructor() {}
  getNodeAdminList() {
    return JSON.parse(localStorage.getItem('Node_Admin'));
  }
  addNodeAdmin(newNodeAdmin) {
    localStorage.setItem('Node_Admin', JSON.stringify(newNodeAdmin));
  }
}
