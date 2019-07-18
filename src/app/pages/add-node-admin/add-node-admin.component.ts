import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NodeAdminService } from 'src/app/services/node-admin.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-node-admin',
  templateUrl: './add-node-admin.component.html',
  styleUrls: ['./add-node-admin.component.scss'],
})
export class AddNodeAdminComponent implements OnInit {
  formAddNodeAdmin: FormGroup;
  ipAddressField = new FormControl('', Validators.required);
  constructor(
    private dialogRef: MatDialogRef<AddNodeAdminComponent>,
    private nodeAdminServ: NodeAdminService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.formAddNodeAdmin = new FormGroup({
      ipAddress: this.ipAddressField,
    });
  }

  ngOnInit() {}
  onAddNodeAdmin() {
    if (this.formAddNodeAdmin.valid) {
      let nodeAdded: string;
      this.translate
        .get('Node Admin Added!')
        .subscribe(res => (nodeAdded = res));
      let nodeAddedMessage: string;
      this.translate
        .get('Your Node Already Added with IP Address')
        .subscribe(res => (nodeAddedMessage = res));
      Swal.fire(
        nodeAdded,
        `${nodeAddedMessage} : ${this.ipAddressField.value}`,
        'success'
      );
      const attribute = this.formAddNodeAdmin.value;
      this.nodeAdminServ.addNodeAdmin(attribute);
      this.dialogRef.close();
      this.router.navigateByUrl('/nodeadmin');
    }
  }
}
