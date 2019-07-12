import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-addcontact',
  templateUrl: './addcontact.component.html',
  styleUrls: ['./addcontact.component.scss'],
})
export class AddcontactComponent implements OnInit {
  contacts = [];

  addForm: FormGroup;
  aliasField = new FormControl('', Validators.required);
  addressField = new FormControl('', Validators.required);

  constructor(
    private contactServ: ContactService,
    public dialogRef: MatDialogRef<AddcontactComponent>
  ) {
    this.addForm = new FormGroup({
      alias: this.aliasField,
      address: this.addressField,
    });

    this.contacts = this.contactServ.getContactList();
  }

  ngOnInit() {}

  onSubmit() {
    if (this.addForm.valid) {
      const newContact = this.addForm.value;
      this.contacts = this.contacts || [];
      this.contacts.push(newContact);
      this.contactServ.addContact(newContact);
      this.dialogRef.close(this.contacts);
    }
  }
}
