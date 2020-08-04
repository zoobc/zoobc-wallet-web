import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NodeAdminService } from 'src/app/services/node-admin.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import zoobc, { RequestType } from 'zoobc-sdk';
import { AuthService } from 'src/app/services/auth.service';
import { getTranslation } from 'src/helpers/utils';

@Component({
  selector: 'app-add-node-admin',
  templateUrl: './add-node-admin.component.html',
})
export class AddNodeAdminComponent {
  isLoading: boolean = false;
  formAddNodeAdmin: FormGroup;
  ipAddressField = new FormControl('', [
    Validators.required,
    Validators.pattern('^https?://+[\\w.-]+:\\d+$'),
  ]);
  constructor(
    private dialogRef: MatDialogRef<AddNodeAdminComponent>,
    private nodeAdminServ: NodeAdminService,
    private router: Router,
    private translate: TranslateService,
    private authSrv: AuthService
  ) {
    this.formAddNodeAdmin = new FormGroup({
      ipAddress: this.ipAddressField,
    });
  }

  onAddNodeAdmin() {
    if (this.formAddNodeAdmin.valid) {
      this.isLoading = true;
      const childSeed = this.authSrv.seed;

      const auth: string = zoobc.Poown.createAuth(RequestType.GETPROOFOFOWNERSHIP, childSeed);

      zoobc.Poown.request(auth, this.ipAddressField.value)
        .then(async () => {
          let message = getTranslation('node admin added!', this.translate);
          this.isLoading = false;
          this.nodeAdminServ.addNodeAdmin(this.ipAddressField.value);
          Swal.fire('', message, 'success').then(() => {
            this.dialogRef.close();
            setTimeout(() => {
              this.router.navigateByUrl('/nodeadmin');
            }, 400);
          });
        })
        .catch(async err => {
          Swal.fire('Error', err.message, 'error');
          this.isLoading = false;
        });
    }
  }
}
