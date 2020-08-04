import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ContactService, Contact } from 'src/app/services/contact.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { isZBCAddressValid } from 'zoobc-sdk';
import { getTranslation } from 'src/helpers/utils';
import { QrScannerComponent } from '../../qr-scanner/qr-scanner.component';

@Component({
  selector: 'app-addcontact',
  templateUrl: './addcontact.component.html',
})
export class AddcontactComponent implements OnInit {
  addForm: FormGroup;
  aliasField = new FormControl('', Validators.required);
  addressField = new FormControl('', Validators.required);

  constructor(
    private contactServ: ContactService,
    public dialogRef: MatDialogRef<AddcontactComponent>,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.addForm = new FormGroup({
      alias: this.aliasField,
      address: this.addressField,
    });
  }

  ngOnInit() {}

  onAddressValidation() {
    const validation = isZBCAddressValid(this.addressField.value);
    if (!validation) {
      this.addressField.setErrors({ invalidAddress: true });
    }
  }

  async onSubmit() {
    if (this.addForm.valid) {
      const isDuplicate = this.contactServ.isDuplicate(this.addressField.value);
      if (isDuplicate) {
        let message = getTranslation('the address you entered is already in your contact', this.translate);
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: message,
        });
      } else {
        const contacts: Contact[] = this.contactServ.add(this.addForm.value);
        this.dialogRef.close(contacts);
      }
    }
  }

  openScannerForm() {
    const dialog = this.dialog.open(QrScannerComponent, {
      width: '480px',
      maxHeight: '99vh',
      data: 'string',
      disableClose: true,
    });
    dialog.afterClosed().subscribe((data: any) => {
      if (data) {
        this.addressField.setValue(data[0]);
        this.addressField.updateValueAndValidity();
      }
    });
  }
}
