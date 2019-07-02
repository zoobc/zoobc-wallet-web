import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-addcontact',
  templateUrl: './addcontact.component.html',
  styleUrls: ['./addcontact.component.scss'],
})
export class AddcontactComponent implements OnInit {
  contacts = [];

  @ViewChild('f') form: any;
  constructor(private appServ: AppService, private route: Router) {}

  ngOnInit() {
    this.contacts = this.appServ.getContactList();
  }

  onSubmit() {
    if (this.form.value) {
      let newContact = {
        id: uuid(),
        alias: this.form.value.alias,
        address: this.form.value.address,
      };
      console.log(newContact);
      this.contacts = this.contacts || [];
      this.contacts.push(newContact);
      this.appServ.addContact(newContact);
      this.route.navigateByUrl('/Contact-list');
    }
  }
}
