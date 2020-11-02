import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddcontactComponent } from '../addcontact/addcontact.component';
import { EditcontactComponent } from '../editcontact/editcontact.component';
import Swal from 'sweetalert2';
import { ContactService, Contact } from 'src/app/services/contact.service';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import { isZBCAddressValid } from 'zoobc-sdk';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['./contactlist.component.scss'],
})
export class ContactlistComponent implements OnInit {
  contacts: Contact[];
  @ViewChild('fileInput') myInputVariable: ElementRef;

  constructor(
    private contactServ: ContactService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.contacts = this.contactServ.getList();
  }

  async deleteContact(contact: Contact) {
    let sentence = getTranslation('are you sure want to delete?', this.translate, {
      alias: contact.name,
    });
    Swal.fire({
      title: sentence,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.contacts = this.contactServ.delete(contact.address.value);
        return true;
      },
    });
  }

  onOpenAddContact() {
    const dialog = this.dialog.open(AddcontactComponent, {
      width: '460px',
      maxHeight: '90vh',
    });

    dialog.afterClosed().subscribe(contacts => {
      if (contacts) this.contacts = contacts;
    });
  }

  onOpenEditContact(contact) {
    const dialog = this.dialog.open(EditcontactComponent, {
      width: '460px',
      maxHeight: '90vh',
      data: contact,
    });

    dialog.afterClosed().subscribe(contacts => {
      if (contacts) this.contacts = contacts;
    });
  }

  validationFile(file: any): boolean {
    let status;
    if (file.length !== undefined) {
      file.forEach(element => {
        if (element.address) return (status = isZBCAddressValid(element.address));
        return (status = false);
      });
      return status;
    }
    return false;
  }

  onImportContact() {
    this.myInputVariable.nativeElement.click();
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    if (file !== undefined) {
      fileReader.readAsText(file, 'JSON');
      fileReader.onload = async () => {
        let fileResult = JSON.parse(fileReader.result.toString());
        const validation = this.validationFile(fileResult);
        if (!validation) {
          let message = getTranslation('you imported the wrong file', this.translate);
          Swal.fire('Opps...', message, 'error');
        } else {
          let listNewContact = [];
          let checkExistContact: boolean;
          for (let i = 0; i < fileResult.length; i++) {
            checkExistContact = this.contactServ.isDuplicate(fileResult[i].address);
            if (!checkExistContact) {
              listNewContact.push(fileResult[i]);
            }
          }
          if (listNewContact.length === 0) {
            let message = getTranslation('all the new address already in your contact', this.translate);
            Swal.fire('Opps...', message, 'error');
            this.myInputVariable.nativeElement.value = '';
          } else {
            for (const newContact of listNewContact) {
              this.contactServ.add(newContact);
              this.contacts = this.contactServ.getList();
              let message = getTranslation('contact updated', this.translate);
              let subMessage = getTranslation('your new contact has been saved', this.translate);
              Swal.fire(message, subMessage, 'success');
              this.myInputVariable.nativeElement.value = '';
            }
          }
        }
      };
      fileReader.onerror = async err => {
        console.log(err);
        let message = getTranslation('an error occurred while processing your request', this.translate);
        Swal.fire('Opps...', message, 'error');
      };
    }
  }

  onExportContact() {
    let theJSON = JSON.stringify(this.contacts);
    const blob = new Blob([theJSON], { type: 'application/JSON' });
    saveAs(blob, 'Contact-List.json');
  }
}
