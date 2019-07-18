import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface NodeAdminAttribute {
  ipAddress: string;
}

@Injectable({
  providedIn: 'root',
})
export class NodeAdminService {
  private sourceCurrencyNodeAdminAttribue = new BehaviorSubject({});
  nodeAdminAttribute = this.sourceCurrencyNodeAdminAttribue.asObservable();
  attribute: NodeAdminAttribute;

  constructor(private http: HttpClient) {
    let attributes = JSON.parse(localStorage.getItem('Node_Admin'));
    this.sourceCurrencyNodeAdminAttribue.next(attributes);

    this.nodeAdminAttribute.subscribe(
      (res: NodeAdminAttribute) => (this.attribute = res)
    );
  }
  getNodeAdminList() {
    return JSON.parse(localStorage.getItem('Node_Admin'));
  }
  addNodeAdmin(attribute: NodeAdminAttribute) {
    this.sourceCurrencyNodeAdminAttribue.next(attribute);
    localStorage.setItem('Node_Admin', JSON.stringify(attribute));
  }
}
