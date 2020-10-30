import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Swal from 'sweetalert2';
import zoobc, { RegisterNodeInterface, ZBCAddressToBytes } from 'zoobc-sdk';
import { NodeAdminService } from 'src/app/services/node-admin.service';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import {
  createRegisterNodeForm,
  registerNodeMap,
} from 'src/app/components/transaction-form/form-register-node/form-register-node.component';
@Component({
  selector: 'app-register-node',
  templateUrl: './register-node.component.html',
})
export class RegisterNodeComponent implements OnInit {
  formRegisterNode: FormGroup;

  account: SavedAccount;
  poown: Buffer;
  isLoading: boolean = false;
  isError: boolean = false;

  registerNodeMap = registerNodeMap;

  constructor(
    private authServ: AuthService,
    private nodeAdminServ: NodeAdminService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<RegisterNodeComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public myNodePubKey: string
  ) {
    this.formRegisterNode = createRegisterNodeForm();
    this.account = authServ.getCurrAccount();
    this.formRegisterNode.get('ipAddress').patchValue(this.account.nodeIP);
  }

  ngOnInit() {
    if (this.myNodePubKey) this.formRegisterNode.get('nodePublicKey').patchValue(this.myNodePubKey);
  }

  onRegisterNode() {
    if (this.formRegisterNode.valid) {
      const nodePublicKeyForm = this.formRegisterNode.get('nodePublicKey');
      const ipAddressForm = this.formRegisterNode.get('ipAddress');
      const feeForm = this.formRegisterNode.get('fee');
      const lockedBalanceForm = this.formRegisterNode.get('lockedBalance');

      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
        maxHeight: '90vh',
      });

      pinRefDialog.afterClosed().subscribe(isPinValid => {
        if (isPinValid) {
          this.isLoading = true;
          this.isError = false;

          let data: RegisterNodeInterface = {
            accountAddress: { address: this.account.address, type: 0 },
            nodePublicKey: ZBCAddressToBytes(nodePublicKeyForm.value),
            nodeAddress: ipAddressForm.value,
            fee: feeForm.value,
            funds: lockedBalanceForm.value,
          };

          zoobc.Node.register(data, this.authServ.seed)
            .then(() => {
              let message = getTranslation('your node will be registered soon', this.translate);
              Swal.fire('Success', message, 'success');

              // change IP if has different value
              if (ipAddressForm.value != this.account.nodeIP)
                this.nodeAdminServ.editIpAddress(ipAddressForm.value);

              this.dialogRef.close(true);
            })
            .catch(err => {
              console.log(err);
              Swal.fire('Error', err, 'error');
              this.isError = true;
            })
            .finally(() => (this.isLoading = false));
        }
      });
    }
  }
}
