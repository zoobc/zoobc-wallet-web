import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContactService } from 'src/app/services/contact.service';

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
  }

  onSubmit() {
    if (this.editForm.valid) {
      let contacts = this.contactServ.updateContact(
        this.contact,
        this.editForm.value
      );
      this.dialogRef.close(contacts);
    }
  }
}
