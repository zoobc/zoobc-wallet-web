import { Component, OnInit } from '@angular/core';
export interface PrivacyPolicy {
  no: number;
  name: string;
  function: string;
  partyProvide: string;
  typeCookies: string;
  durability: string;
}

const ELEMENT_DATA: PrivacyPolicy[] = [
  {no: 1, name: 'Google Analytics', function: 'Analytics', partyProvide: '3rd - Google', typeCookies:'Persistent',durability:'2 years'},
  {no: 2, name: 'Sentry', function: 'Error Reporting', partyProvide: '3rd - Sentry', typeCookies:'N/A', durability:'N/A'},
  {no: 3, name: 'local storage', function: 'Analytics', partyProvide: '1st - UID set by ZooBC',typeCookies:'N/A',durability:'Depends on browser (See “How to Clear Local Storage from Your Browser” below)'}
];

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  displayedColumns: string[] = ['no', 'name', 'function', 'partyProvide','typeCookies','durability'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
