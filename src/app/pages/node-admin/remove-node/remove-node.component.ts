import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isPubKeyValid } from 'src/helpers/utils';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import Swal from 'sweetalert2';
import { TransactionService } from 'src/app/services/transaction.service';
import { NodeRegistration } from 'src/app/grpc/model/nodeRegistration_pb';
import zoobc, { RemoveNodeInterface } from 'zoobc-sdk';

type RegisteredNode = NodeRegistration.AsObject;

@Component({
  selector: 'app-remove-node',
  templateUrl: './remove-node.component.html',
  styleUrls: ['./remove-node.component.scss'],
})
export class RemoveNodeComponent implements OnInit {
  formRemoveNode: FormGroup;
  feeForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  nodePublicKeyForm = new FormControl('', Validators.required);

  account: SavedAccount;

  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private transactionServ: TransactionService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RemoveNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public node: RegisteredNode
  ) {
    this.formRemoveNode = new FormGroup({
      fee: this.feeForm,
      nodePublicKey: this.nodePublicKeyForm,
    });

    this.account = authServ.getCurrAccount();
    this.nodePublicKeyForm.patchValue(this.node.nodepublickey);
  }

  ngOnInit() {}

  onChangeNodePublicKey() {
    let isValid = isPubKeyValid(this.nodePublicKeyForm.value);
    if (!isValid) this.nodePublicKeyForm.setErrors({ invalidAddress: true });
  }

  onRemoveNode() {
    if (this.formRemoveNode.valid) {
      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
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

          zoobc.Node.remove(data, this.authServ.getSeed)
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
