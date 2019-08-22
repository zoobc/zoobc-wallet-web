import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddcontactComponent } from '../addcontact/addcontact.component';
import { EditcontactComponent } from '../editcontact/editcontact.component';
import Swal from 'sweetalert2';
import { ContactService, Contact } from 'src/app/services/contact.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['./contactlist.component.scss'],
})
export class ContactlistComponent implements OnInit {
  contacts: Contact[];

  constructor(
    private contactServ: ContactService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.contacts = this.contactServ.getContactList();
  }

  deleteContact(contact) {
    let sentence: string;
    this.translate
      .get('Are you sure want to delete?', { alias: contact.alias })
      .subscribe(res => (sentence = res));
    Swal.fire({
      title: sentence,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.contacts = this.contactServ.deleteContact(contact.address);
        return true;
      },
    });
  }

  onOpenAddContact() {
    const dialog = this.dialog.open(AddcontactComponent, {
      width: '460px',
    });

    dialog.afterClosed().subscribe(contacts => {
      if (contacts) this.contacts = contacts;
    });
  }

  onOpenEditContact(contact) {
    const dialog = this.dialog.open(EditcontactComponent, {
      width: '460px',
      data: contact,
    });

    dialog.afterClosed().subscribe(contacts => {
      if (contacts) this.contacts = contacts;
    });
  }
}
