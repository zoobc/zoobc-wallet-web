import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContactService, Contact } from 'src/app/services/contact.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { isZBCAddressValid } from 'zoobc-sdk';

@Component({
  selector: 'app-editcontact',
  templateUrl: './editcontact.component.html',
})
export class EditcontactComponent implements OnInit {
  editForm: FormGroup;
  aliasField: FormControl;
  addressField: FormControl;

  constructor(
    private contactServ: ContactService,
    public dialogRef: MatDialogRef<EditcontactComponent>,
    @Inject(MAT_DIALOG_DATA) public contact: any,
    private translate: TranslateService
  ) {}

  onAddressValidation() {
    const validation = isZBCAddressValid(this.addressField.value);
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
  }

  async onSubmit() {
    if (this.editForm.valid) {
      const isDuplicate = this.contactServ.isDuplicate(this.addressField.value);
      const isChanged =
        this.addressField.value != this.contact.address ? true : false;

      if (isDuplicate && isChanged) {
        let message: string;
        await this.translate
          .get('The address you entered is already in your Address Book')
          .toPromise()
          .then(res => (message = res));
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: message,
        });
      } else {
        const contacts: Contact[] = this.contactServ.update(
          this.editForm.value,
          this.contact.address
        );
        this.dialogRef.close(contacts);
      }
    }
  }
}
