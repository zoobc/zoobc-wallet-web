import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddcontactComponent } from '../addcontact/addcontact.component';
import { EditcontactComponent } from '../editcontact/editcontact.component';
import Swal from 'sweetalert2';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['./contactlist.component.scss'],
})
export class ContactlistComponent implements OnInit {
  contacts;

  constructor(private contactServ: ContactService, private dialog: MatDialog) {}

  ngOnInit() {
    this.contacts = this.contactServ.getContactList();
  }

  deleteContact(contact) {
    Swal.fire({
      title: `Are you sure want to delete '${contact.alias}'?`,
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
