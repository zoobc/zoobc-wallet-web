// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

//     2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
// contact us at roberto.capodieci[at]blockchainzoo.com
// and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddcontactComponent } from '../addcontact/addcontact.component';
import { EditcontactComponent } from '../editcontact/editcontact.component';
import Swal from 'sweetalert2';
import { ContactService, Contact } from 'src/app/services/contact.service';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import { isZBCAddressValid } from 'zbc-sdk';
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
        if (element.address) return (status = isZBCAddressValid(element.address, 'ZBC'));
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
