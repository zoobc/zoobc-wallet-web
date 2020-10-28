import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import Swal from 'sweetalert2';
import zoobc, { ZBCAddressToBytes, ClaimNodeInterface, TransactionType } from 'zoobc-sdk';
import { getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { createInnerTxForm } from 'src/helpers/multisig-utils';
import {
  claimNodeMap,
  createClaimNodeForm,
} from 'src/app/components/transaction-form/form-claim-node/form-claim-node.component';
@Component({
  selector: 'app-claim-node',
  templateUrl: './claim-node.component.html',
})
export class ClaimNodeComponent implements OnInit {
  formClaimNode: FormGroup;
  account: SavedAccount;
  isLoading: boolean = false;
  isError: boolean = false;
  claimNodeMap = claimNodeMap;

  constructor(
    private authServ: AuthService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ClaimNodeComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public myNodePubKey: string
  ) {
    this.formClaimNode = createClaimNodeForm();
    this.account = authServ.getCurrAccount();
    this.formClaimNode.get('ipAddress').patchValue(this.account.nodeIP);
  }

  ngOnInit() {
    if (this.myNodePubKey) this.formClaimNode.get('nodePublicKey').patchValue(this.myNodePubKey);
  }

  onClaimNode() {
    if (this.formClaimNode.valid) {
      const nodePublicKeyForm = this.formClaimNode.get('nodePublicKey');
      const feeForm = this.formClaimNode.get('fee');
      const ipAddressForm = this.formClaimNode.get('ipAddress');

      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
        maxHeight: '90vh',
      });
      pinRefDialog.afterClosed().subscribe(isPinValid => {
        if (isPinValid) {
          const data: ClaimNodeInterface = {
            accountAddress: { address: this.account.address, type: 0 },
            nodePublicKey: ZBCAddressToBytes(nodePublicKeyForm.value),
            fee: feeForm.value,
            nodeAddress: ipAddressForm.value,
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
              Swal.fire('Error', err.message, 'error');
              this.isError = true;
            })
            .finally(() => (this.isLoading = false));
        }
      });
    }
  }
}
