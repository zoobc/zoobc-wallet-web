import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PoownService } from 'src/app/services/poown.service';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { isPubKeyValid } from 'src/helpers/utils';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import {
  UpdateNodeInterface,
  updateNodeBuilder,
} from 'src/helpers/transaction-builder/update-node';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-node',
  templateUrl: './update-node.component.html',
  styleUrls: ['./update-node.component.scss'],
})
export class UpdateNodeComponent implements OnInit {
  formUpdateNode: FormGroup;
  ipAddressForm = new FormControl('', Validators.required);
  lockedAmountForm = new FormControl('', [
    Validators.required,
    Validators.min(1 / 1e8),
  ]);
  feeForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  nodePublicKeyForm = new FormControl('', Validators.required);

  poown: Buffer;

  account: SavedAccount;

  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    private poownServ: PoownService,
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private transactionServ: TransactionService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<UpdateNodeComponent>
  ) {
    this.formUpdateNode = new FormGroup({
      ipAddress: this.ipAddressForm,
      lockedAmount: this.lockedAmountForm,
      fee: this.feeForm,
      nodePublicKey: this.nodePublicKeyForm,
    });

    this.account = authServ.getCurrAccount();
  }

  ngOnInit() {
    this.isLoading = true;
    this.formUpdateNode.disable();
    this.poownServ.get(this.account.nodeIP).then(
      (res: Buffer) => {
        this.isLoading = false;
        this.poown = res;
        let address = res.toString('utf-8', 0, 44);
        if (this.account.address == address) {
          this.formUpdateNode.enable();
          this.ipAddressForm.patchValue(this.account.nodeIP);
        } else {
          this.isError = true;
          this.formUpdateNode.disable();
        }
      },
      err => {
        this.isError = true;
        this.formUpdateNode.disable();
        console.log(err);
      }
    );
  }

  onChangeRecipient() {
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

          let data: UpdateNodeInterface = {
            accountAddress: this.account.address,
            nodePublicKey: this.nodePublicKeyForm.value,
            nodeAddress: this.ipAddressForm.value,
            fee: this.feeForm.value,
            funds: this.lockedAmountForm.value,
            poown: this.poown,
          };
          let bytes = updateNodeBuilder(data, this.keyringServ);

          this.transactionServ.postTransaction(bytes).then(
            (res: any) => {
              Swal.fire('Success', 'success', 'success');
              this.isLoading = false;
              this.dialogRef.close(true);
            },
            err => {
              console.log(err);
              Swal.fire('Error', err, 'error');
              this.isLoading = false;
              this.isError = true;
            }
          );
        }
      });
    }
  }
}
