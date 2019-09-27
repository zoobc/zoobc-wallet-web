import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContactService } from 'src/app/services/contact.service';
import { addressValidation } from 'src/helpers/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editcontact',
  templateUrl: './editcontact.component.html',
  styleUrls: ['./editcontact.component.scss'],
})
export class EditcontactComponent implements OnInit {
  contacts = [];

  editForm: FormGroup;
  aliasField: FormControl;
  addressField: FormControl;

  constructor(
    private contactServ: ContactService,
    public dialogRef: MatDialogRef<EditcontactComponent>,
    @Inject(MAT_DIALOG_DATA) public contact: any
  ) {}

  onAddressValidation() {
    const validation = addressValidation(this.addressField.value);
    if (!validation) {
      this.addressField.setErrors({ invalidAddress: true });
    }
  }

  ngOnInit() {
    this.aliasField = new FormControl(this.contact.alias, Validators.required);
    this.addressField = new FormControl(
      this.contact.address,
      Validators.required
    );

    this.editForm = new FormGroup({
      alias: this.aliasField,
      address: this.addressField,
    });
    this.contacts = this.contactServ.getContactList() || [];
  }

  onSubmit() {
    if (this.editForm.valid) {
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
      } else {
        let contacts = this.contactServ.updateContact(
          this.contact,
          this.editForm.value
        );
        this.dialogRef.close(contacts);
      }
    }
  }
}
