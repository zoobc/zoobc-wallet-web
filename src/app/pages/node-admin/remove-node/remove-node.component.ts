import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import Swal from 'sweetalert2';
import zoobc, { NodeRegistration, RemoveNodeInterface, ZBCAddressToBytes } from 'zbc-sdk';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import {
  createRemoveNodeForm,
  removeNodeMap,
} from 'src/app/components/transaction-form/form-remove-node/form-remove-node.component';

@Component({
  selector: 'app-remove-node',
  templateUrl: './remove-node.component.html',
})
export class RemoveNodeComponent implements OnInit {
  formRemoveNode: FormGroup;
  account: SavedAccount;
  isLoading: boolean = false;
  isError: boolean = false;
  removeNodeMap = removeNodeMap;

  constructor(
    private authServ: AuthService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RemoveNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public node: NodeRegistration,
    private translate: TranslateService
  ) {
    this.formRemoveNode = createRemoveNodeForm();
    this.account = authServ.getCurrAccount();
    this.formRemoveNode.get('nodePublicKey').patchValue(this.node.nodePublicKey);
  }

  ngOnInit() {}

  onRemoveNode() {
    if (this.formRemoveNode.valid) {
      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
        maxHeight: '90vh',
      });

      pinRefDialog.afterClosed().subscribe(isPinValid => {
        if (isPinValid) {
          this.isLoading = true;
          this.isError = false;

          let data: RemoveNodeInterface = {
            accountAddress: this.account.address,
            nodePublicKey: ZBCAddressToBytes(this.formRemoveNode.get('nodePublicKey').value),
            fee: this.formRemoveNode.get('fee').value,
            message: this.formRemoveNode.get('message').value,
          };
          zoobc.Node.remove(data, this.authServ.seed)
            .then(() => {
              let message = getTranslation('your node will be removed soon', this.translate);
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
