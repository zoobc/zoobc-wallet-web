import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NodeAdminService } from 'src/app/services/node-admin.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    this.formAddNodeAdmin = new FormGroup({
      ipAddress: this.ipAddressField,
    });
  }

  ngOnInit() { }
  onAddNodeAdmin() {
    if (this.formAddNodeAdmin.valid) {
      Swal.fire(
        'Node Admin Added!',
        'Your Node Already Added with IP Address : ' +
        `${this.ipAddressField.value}`,
        'success'
      );
      const attribute = this.formAddNodeAdmin.value;
      this.nodeAdminServ.addNodeAdmin(attribute);
      this.dialogRef.close();
      this.router.navigateByUrl('/nodeadmin');
    }
  }
}
