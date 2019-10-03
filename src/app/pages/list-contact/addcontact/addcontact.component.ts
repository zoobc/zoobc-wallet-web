import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ContactService, Contact } from 'src/app/services/contact.service';
import Swal from 'sweetalert2';
import { addressValidation } from 'src/helpers/utils';

@Component({
  selector: 'app-addcontact',
  templateUrl: './addcontact.component.html',
  styleUrls: ['./addcontact.component.scss'],
})
export class AddcontactComponent implements OnInit {
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
  }

  ngOnInit() {}

  onAddressValidation() {
    const validation = addressValidation(this.addressField.value);
    if (!validation) {
      this.addressField.setErrors({ invalidAddress: true });
    }
  }

  onSubmit() {
    if (this.addForm.valid) {
      const isDuplicate = this.contactServ.isDuplicate(this.addressField.value);
      if (isDuplicate) {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'The address you entered is already in your Address Book',
        });
      } else {
        const contacts: Contact[] = this.contactServ.addContact(
          this.addForm.value
        );
        this.dialogRef.close(contacts);
      }
    }
  }
}
