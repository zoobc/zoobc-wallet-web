import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['./contactlist.component.scss'],
})
export class ContactlistComponent implements OnInit {
  contact;
  constructor(private appServ: AppService, private router: Router) {}

  ngOnInit() {
    this.contact = this.appServ.getContactList();
  }

  deleteContact(address) {
    for (let i = 0; i < this.contact.length; i++) {
      if (this.contact[i].address == address) {
        this.contact.splice(i, 1);
      }
    }

    this.appServ.deleteContact(address);
  }
}
