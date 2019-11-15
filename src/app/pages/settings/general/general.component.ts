import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RevealPassphraseComponent } from 'src/app/components/reveal-passphrase/reveal-passphrase.component';
import { NodeList, Node } from '../../../../helpers/node-list';
import { LanguageService, LANGUAGES } from 'src/app/services/language.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  nodeList: NodeList;
  selectedNode: Node;

  activeLanguage = localStorage.getItem('SELECTED_LANGUAGE') || 'en';
  languages = LANGUAGES;

  constructor(private dialog: MatDialog, private langServ: LanguageService) {
    this.nodeList = JSON.parse(localStorage.getItem('NODE_LIST'));
    this.selectedNode = JSON.parse(localStorage.getItem('SELECTED_NODE'));
  }

  ngOnInit() {}

  onOpenRevealPassphrase() {
    this.dialog.open(RevealPassphraseComponent, {
      width: '420px',
    });
  }

  changeNode(ip: string) {
    const node = this.nodeList.node.find(node => node.ip == ip);
    localStorage.setItem('SELECTED_NODE', JSON.stringify(node));
  }

  changeLanguage(lang: string) {
    this.langServ.setLanguage(lang);
    this.activeLanguage = lang;
  }
}
