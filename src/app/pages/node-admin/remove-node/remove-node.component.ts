import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import Swal from 'sweetalert2';
import zoobc, { RemoveNodeInterface, isZBCPublicKeyValid } from 'zoobc-sdk';

@Component({
  selector: 'app-remove-node',
  templateUrl: './remove-node.component.html',
})
export class RemoveNodeComponent {
  formRemoveNode: FormGroup;
  feeForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  nodePublicKeyForm = new FormControl('', Validators.required);

  account: SavedAccount;

  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    private authServ: AuthService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RemoveNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public node: any
  ) {
    this.formRemoveNode = new FormGroup({
      fee: this.feeForm,
      nodePublicKey: this.nodePublicKeyForm,
    });

    this.account = authServ.getCurrAccount();
    this.nodePublicKeyForm.patchValue(this.node.nodepublickey);
  }

  onChangeNodePublicKey() {
    let isValid = isZBCPublicKeyValid(this.nodePublicKeyForm.value);
    if (!isValid) this.nodePublicKeyForm.setErrors({ invalidAddress: true });
  }

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
            nodePublicKey: this.nodePublicKeyForm.value,
            fee: this.feeForm.value,
          };

          zoobc.Node.remove(data, this.authServ.seed)
            .then(() => {
              Swal.fire('Success', 'Your node will be removed soon', 'success');
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
