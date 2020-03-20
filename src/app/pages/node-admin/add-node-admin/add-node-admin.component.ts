import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NodeAdminService } from 'src/app/services/node-admin.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PoownService } from 'src/app/services/poown.service';
import zoobc, { RequestType } from 'zoobc-sdk';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-node-admin',
  templateUrl: './add-node-admin.component.html',
  styleUrls: ['./add-node-admin.component.scss'],
})
export class AddNodeAdminComponent implements OnInit {
  isLoading: boolean = false;
  formAddNodeAdmin: FormGroup;
  ipAddressField = new FormControl('', [
    Validators.required,
    Validators.pattern('^[\\w.-]+:\\d+$'),
  ]);
  constructor(
    private dialogRef: MatDialogRef<AddNodeAdminComponent>,
    private nodeAdminServ: NodeAdminService,
    private router: Router,
    private translate: TranslateService,
    private poownServ: PoownService,
    private authSrv: AuthService
  ) {
    this.formAddNodeAdmin = new FormGroup({
      ipAddress: this.ipAddressField,
    });
  }

  ngOnInit() {}

  onAddNodeAdmin() {
    if (this.formAddNodeAdmin.valid) {
      this.isLoading = true;

      const currAccount: SavedAccount = this.authSrv.getCurrAccount();
      const childSeed = this.authSrv.getSeed;

      const auth: string = zoobc.Poown.createAuth(
        RequestType.GETPROOFOFOWNERSHIP,
        childSeed
      );

      zoobc.Poown.request(auth, `//${this.ipAddressField.value}`)
        .then(async () => {
          let message: string;
          this.isLoading = false;
          this.nodeAdminServ.addNodeAdmin(this.ipAddressField.value);
          await this.translate
            .get('Node Admin Added!')
            .toPromise()
            .then(res => (message = res));
          Swal.fire('', message, 'success').then(() => {
            this.dialogRef.close();
            setTimeout(() => {
              this.router.navigateByUrl('/nodeadmin');
            }, 400);
          });
        })
        .catch(async err => {
          console.log(err);
          Swal.fire('Error', err, 'error');
          this.isLoading = false;
        });

      // this.poownServ
      //   .get(this.ipAddressField.value)
      //   .then(async () => {
      //     this.isLoading = false;
      //     this.nodeAdminServ.addNodeAdmin(this.ipAddressField.value);

      //     let message: string;
      //     await this.translate
      //       .get('Node Admin Added!')
      //       .toPromise()
      //       .then(res => (message = res));
      //     Swal.fire('', message, 'success').then(() => {
      //       this.dialogRef.close();
      //       // delaying the redirect so the timestamp of poown not in the past
      //       setTimeout(() => {
      //         this.router.navigateByUrl('/nodeadmin');
      //       }, 400);
      //     });
      //   })
      //   .catch(async err => {
      //     console.log(err);
      //     Swal.fire('Error', err, 'error');
      //     this.isLoading = false;
      //   });
    }
  }
}
