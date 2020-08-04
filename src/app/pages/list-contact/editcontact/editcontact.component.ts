import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ContactService, Contact } from 'src/app/services/contact.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { isZBCAddressValid } from 'zoobc-sdk';
import { getTranslation } from 'src/helpers/utils';
import { QrScannerComponent } from '../../qr-scanner/qr-scanner.component';

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
    @Inject(MAT_DIALOG_DATA) public contact: Contact,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  onAddressValidation() {
    const validation = isZBCAddressValid(this.addressField.value);
    if (!validation) {
      this.addressField.setErrors({ invalidAddress: true });
    }
  }

  ngOnInit() {
    this.aliasField = new FormControl(this.contact.name, Validators.required);
    this.addressField = new FormControl(this.contact.address, Validators.required);

    this.editForm = new FormGroup({
      name: this.aliasField,
      address: this.addressField,
    });
  }

  async onSubmit() {
    if (this.editForm.valid) {
      const isDuplicate = this.contactServ.isDuplicate(this.addressField.value);
      const isChanged = this.addressField.value != this.contact.address ? true : false;
      if (isDuplicate && isChanged) {
        let message = await getTranslation(
          'The address you entered is already in your Address Book',
          this.translate
        );
        Swal.fire({ type: 'error', title: 'Oops...', text: message });
      } else {
        const contacts: Contact[] = this.contactServ.update(this.editForm.value, this.contact.address);
        this.dialogRef.close(contacts);
      }
    }
  }
  openScannerForm() {
    let address = this.addressField.value;
    this.addressField.setValue('');
    const dialogQr = this.dialog.open(QrScannerComponent, {
      width: '480px',
      maxHeight: '99vh',
      data: 'string',
      disableClose: true,
    });
    dialogQr.afterClosed().subscribe((data: any) => {
      if (data) {
        this.addressField.setValue(data[0]);
        this.addressField.updateValueAndValidity();
      } else {
        this.addressField.setValue(address);
        this.addressField.updateValueAndValidity();
      }
    });
  }
}
