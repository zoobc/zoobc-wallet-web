import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NodeAdminService } from 'src/app/services/node-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-ip-address',
  templateUrl: './change-ip-address.component.html',
  styleUrls: ['./change-ip-address.component.scss'],
})
export class ChangeIpAddressComponent implements OnInit {
  changeForm: FormGroup;
  ipAddressField: FormControl;
  constructor(
    private nodeAdminServ: NodeAdminService,
    public dialogRef: MatDialogRef<ChangeIpAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public nodeAdminAttributes: any
  ) {}

  ngOnInit() {
    this.ipAddressField = new FormControl(
      this.nodeAdminAttributes.ipAddress,
      Validators.required
    );
    this.changeForm = new FormGroup({
      ipAddress: this.ipAddressField,
    });
  }

  onSubmit() {
    if (this.changeForm.valid) {
      let nodeAdminIP = this.nodeAdminServ.updateIPAddress(
        this.nodeAdminAttributes,
        this.changeForm.value
      );
      Swal.fire(
        'IP Address Changed',
        'Your IP Address has been changed: ' + this.ipAddressField.value,
        'success'
      );
      this.dialogRef.close(nodeAdminIP);
    }
  }
}
