import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ContactService } from 'src/app/services/contact.service';
import { base64ToByteArray } from 'src/helpers/converters';
import Swal from 'sweetalert2';

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

    this.contacts = this.contactServ.getContactList() || [];
  }

  ngOnInit() {}

  onSubmit() {
    if (this.addForm.valid) {
      const validation = base64ToByteArray(this.addressField.value);
      if (validation.byteLength === 33) {
        if (
          this.contacts.some(
            contacts => contacts.address === this.addressField.value
          )
        ) {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'The address you entered is already in your Address Book',
          });
          this.dialogRef.close(this.contacts);
        } else {
          const newContact = this.addForm.value;
          this.contacts.push(newContact);
          this.contactServ.addContact(newContact);
          this.dialogRef.close(this.contacts);
        }
      } else {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'The address you entered is invalid',
        });
        this.dialogRef.close(this.contacts);
      }
    }
  }
}
