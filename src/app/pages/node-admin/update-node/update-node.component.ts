import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Swal from 'sweetalert2';
import zoobc, {
  UpdateNodeInterface,
  ZBCAddressToBytes,
  isZBCAddressValid,
  getZBCAddress,
  TransactionType,
} from 'zoobc-sdk';
import { NodeAdminService } from 'src/app/services/node-admin.service';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import { createInnerTxForm, updateNodeForm } from 'src/helpers/multisig-utils';

@Component({
  selector: 'app-update-node',
  templateUrl: './update-node.component.html',
})
export class UpdateNodeComponent implements OnInit {
  formUpdateNode: FormGroup;
  account: SavedAccount;
  isLoading: boolean = false;
  isError: boolean = false;

  updateNodeForm = updateNodeForm;

  constructor(
    private authServ: AuthService,
    private NodeAdminServ: NodeAdminService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<UpdateNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public node: any,
    private translate: TranslateService
  ) {
    this.formUpdateNode = createInnerTxForm(TransactionType.UPDATENODEREGISTRATIONTRANSACTION);

    const ipAddressForm = this.formUpdateNode.get('ipAddress');
    const nodePublicKeyForm = this.formUpdateNode.get('nodePublicKey');
    const lockedAmountForm = this.formUpdateNode.get('lockedAmount');

    this.account = authServ.getCurrAccount();
    ipAddressForm.patchValue(this.account.nodeIP);
    const formatAddressPubKey = getZBCAddress(
      Buffer.from(this.node.nodepublickey.toString(), 'base64'),
      'ZNK'
    );
    const validFormatAddress = isZBCAddressValid(this.node.nodepublickey, 'ZNK');

    if (validFormatAddress) nodePublicKeyForm.patchValue(this.node.nodepublickey);
    else nodePublicKeyForm.patchValue(formatAddressPubKey);

    lockedAmountForm.patchValue(parseInt(this.node.lockedbalance) / 1e8);
    lockedAmountForm.setValidators([
      Validators.required,
      Validators.min(parseInt(this.node.lockedbalance) / 1e8),
    ]);
  }

  ngOnInit() {}

  onChangeNodePublicKey() {
    let isValid = isZBCAddressValid(this.formUpdateNode.get('nodePublicKey').value, 'ZNK');
    if (!isValid) this.formUpdateNode.get('nodePublicKey').setErrors({ invalidAddress: true });
  }

  onUpdateNode() {
    if (this.formUpdateNode.valid) {
      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
        maxHeight: '90vh',
      });

      pinRefDialog.afterClosed().subscribe(isPinValid => {
        if (isPinValid) {
          this.isLoading = true;
          this.isError = false;

          let data: UpdateNodeInterface = {
            accountAddress: this.account.address,
            fee: this.formUpdateNode.get('fee').value,
            nodePublicKey: ZBCAddressToBytes(this.formUpdateNode.get('nodePublicKey').value),
            nodeAddress: this.formUpdateNode.get('ipAddress').value,
            funds: this.formUpdateNode.get('lockedAmount').value,
          };

          zoobc.Node.update(data, this.authServ.seed)
            .then(() => {
              let message = getTranslation('your node will be updated soon', this.translate);
              Swal.fire('Success', message, 'success');

              // change IP if has different value
              if (this.formUpdateNode.get('ipAddress').value != this.account.nodeIP)
                this.NodeAdminServ.editIpAddress(this.formUpdateNode.get('ipAddress').value);

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
