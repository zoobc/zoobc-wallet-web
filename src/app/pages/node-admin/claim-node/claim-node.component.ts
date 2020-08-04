import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import Swal from 'sweetalert2';
import zoobc, { ZBCAddressToBytes, ClaimNodeInterface } from 'zoobc-sdk';
import { getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-claim-node',
  templateUrl: './claim-node.component.html',
})
export class ClaimNodeComponent {
  formClaimNode: FormGroup;
  feeForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  nodePublicKeyForm = new FormControl('', Validators.required);
  ipAddressForm = new FormControl('', [Validators.required, Validators.pattern('^https?://+[\\w.-]+:\\d+$')]);

  account: SavedAccount;

  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    private authServ: AuthService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ClaimNodeComponent>,
    private translate: TranslateService
  ) {
    this.formClaimNode = new FormGroup({
      fee: this.feeForm,
      nodePublicKey: this.nodePublicKeyForm,
      ipAddress: this.ipAddressForm,
    });

    this.account = authServ.getCurrAccount();

    this.ipAddressForm.patchValue(this.account.nodeIP);
  }

  onChangeNodePublicKey() {
    let isValid = ZBCAddressToBytes(this.nodePublicKeyForm.value);
    if (!isValid) this.nodePublicKeyForm.setErrors({ invalidAddress: true });
  }

  onClaimNode() {
    if (this.formClaimNode.valid) {
      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
        maxHeight: '90vh',
      });
      pinRefDialog.afterClosed().subscribe(isPinValid => {
        if (isPinValid) {
          const data: ClaimNodeInterface = {
            accountAddress: this.account.address,
            nodePublicKey: ZBCAddressToBytes(this.nodePublicKeyForm.value),
            fee: this.feeForm.value,
            nodeAddress: this.ipAddressForm.value,
          };
          const seed = this.authServ.seed;

          zoobc.Node.claim(data, seed)
            .then(() => {
              let message = getTranslation('your node will be claimed soon', this.translate);
              Swal.fire('Success', message, 'success');
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
