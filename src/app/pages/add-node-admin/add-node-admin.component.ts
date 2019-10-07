import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NodeAdminService } from 'src/app/services/node-admin.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PoownService } from 'src/app/services/poown.service';
import { ProofOfOwnership } from 'src/app/grpc/model/proofOfOwnership_pb';
import { GenerateNodeKeyResponse } from '../../grpc/model/node_pb';

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
    Validators.pattern('^(https?://.*):(\\d*)*$'),
  ]);
  constructor(
    private dialogRef: MatDialogRef<AddNodeAdminComponent>,
    private nodeAdminServ: NodeAdminService,
    private router: Router,
    private translate: TranslateService,
    private poownServ: PoownService
  ) {
    this.formAddNodeAdmin = new FormGroup({
      ipAddress: this.ipAddressField,
    });
  }

  ngOnInit() {}

  onAddNodeAdmin() {
    if (this.formAddNodeAdmin.valid) {
      this.isLoading = true;
      this.poownServ
        .get(this.ipAddressField.value)
        .then(async (res: ProofOfOwnership) => {
          let promise: Promise<any>;
          await setTimeout(() => {
            promise = this.nodeAdminServ.generateNodeKey(
              this.ipAddressField.value
            );
          }, 1000);
          return promise;
        })
        .then((res: GenerateNodeKeyResponse.AsObject) => {
          this.isLoading = false;
          this.nodeAdminServ.addNodeAdmin(this.ipAddressField.value);

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
          ).then(() => {
            this.dialogRef.close();
            // delaying the redirect so the timestamp of poown not in the past
            setTimeout(() => {
              this.router.navigateByUrl('/nodeadmin');
            }, 400);
          });
        })
        .catch(err => {
          console.log(err);
          Swal.fire('Error', err, 'error');
          this.isLoading = false;
        });
    }
  }
}
