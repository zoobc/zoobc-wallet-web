import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PoownService } from 'src/app/services/poown.service';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { isPubKeyValid } from 'src/helpers/utils';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  UpdateNodeInterface,
  updateNodeBuilder,
} from 'src/helpers/transaction-builder/update-node';
import Swal from 'sweetalert2';
import { NodeRegistration } from 'src/app/grpc/model/nodeRegistration_pb';

type RegisteredNode = NodeRegistration.AsObject;

@Component({
  selector: 'app-update-node',
  templateUrl: './update-node.component.html',
  styleUrls: ['./update-node.component.scss'],
})
export class UpdateNodeComponent implements OnInit {
  formUpdateNode: FormGroup;
  ipAddressForm = new FormControl('', [
    Validators.required,
    Validators.pattern('^[\\w.-]+:\\d+$'),
  ]);
  lockedAmountForm = new FormControl('', [
    Validators.required,
    Validators.min(1 / 1e8),
  ]);
  feeForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  nodePublicKeyForm = new FormControl('', Validators.required);

  account: SavedAccount;

  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    private poownServ: PoownService,
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private transactionServ: TransactionService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<UpdateNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public node: RegisteredNode
  ) {
    this.formUpdateNode = new FormGroup({
      ipAddress: this.ipAddressForm,
      lockedAmount: this.lockedAmountForm,
      fee: this.feeForm,
      nodePublicKey: this.nodePublicKeyForm,
    });

    this.account = authServ.getCurrAccount();
    this.ipAddressForm.patchValue(this.account.nodeIP);
    this.nodePublicKeyForm.patchValue(this.node.nodepublickey);
    this.lockedAmountForm.patchValue(parseInt(this.node.lockedbalance) / 1e8);

    this.lockedAmountForm.setValidators([
      Validators.required,
      Validators.min(parseInt(this.node.lockedbalance) / 1e8),
    ]);
  }

  ngOnInit() {}

  onChangeNodePublicKey() {
    let isValid = isPubKeyValid(this.nodePublicKeyForm.value);
    if (!isValid) this.nodePublicKeyForm.setErrors({ invalidAddress: true });
  }

  onUpdateNode() {
    if (this.formUpdateNode.valid) {
      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
      });

      pinRefDialog.afterClosed().subscribe(isPinValid => {
        if (isPinValid) {
          this.isLoading = true;
          this.isError = false;

          this.poownServ
            .get(this.ipAddressForm.value)
            .then((poown: Buffer) => {
              let data: UpdateNodeInterface = {
                accountAddress: this.account.address,
                nodePublicKey: this.nodePublicKeyForm.value,
                nodeAddress: this.ipAddressForm.value,
                fee: this.feeForm.value,
                funds: this.lockedAmountForm.value,
                poown: poown,
              };
              let bytes = updateNodeBuilder(data, this.keyringServ);

              return this.transactionServ.postTransaction(bytes);
            })
            .then(() => {
              Swal.fire('Success', 'Your node will be updated soon', 'success');

              // change IP if has different value
              if (this.ipAddressForm.value != this.account.nodeIP)
                this.authServ.editNodeIpAddress(this.ipAddressForm.value);

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
