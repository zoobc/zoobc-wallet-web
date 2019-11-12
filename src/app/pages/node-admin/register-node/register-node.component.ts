import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { PoownService } from 'src/app/services/poown.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { isPubKeyValid } from 'src/helpers/utils';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import Swal from 'sweetalert2';
import {
  registerNodeBuilder,
  RegisterNodeInterface,
} from 'src/helpers/transaction-builder/register-node';

@Component({
  selector: 'app-register-node',
  templateUrl: './register-node.component.html',
  styleUrls: ['./register-node.component.scss'],
})
export class RegisterNodeComponent implements OnInit {
  formRegisterNode: FormGroup;
  ipAddressForm = new FormControl('', [
    Validators.required,
    Validators.pattern(
      '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$'
    ),
  ]);
  lockedBalanceForm = new FormControl('', [
    Validators.required,
    Validators.min(1 / 1e8),
  ]);
  feeForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  nodePublicKeyForm = new FormControl('', Validators.required);

  account: SavedAccount;
  poown: Buffer;

  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private poownServ: PoownService,
    private transactionServ: TransactionService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<RegisterNodeComponent>
  ) {
    this.formRegisterNode = new FormGroup({
      ipAddress: this.ipAddressForm,
      lockedBalance: this.lockedBalanceForm,
      fee: this.feeForm,
      nodePublicKey: this.nodePublicKeyForm,
    });

    this.account = authServ.getCurrAccount();
    this.ipAddressForm.patchValue(this.account.nodeIP);
  }

  ngOnInit() {}

  onChangeRecipient() {
    let isValid = isPubKeyValid(this.nodePublicKeyForm.value);
    if (!isValid) this.nodePublicKeyForm.setErrors({ invalidAddress: true });
  }

  onRegisterNode() {
    if (this.formRegisterNode.valid) {
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
              let data: RegisterNodeInterface = {
                accountAddress: this.account.address,
                nodePublicKey: this.nodePublicKeyForm.value,
                nodeAddress: this.ipAddressForm.value,
                fee: this.feeForm.value,
                funds: this.lockedBalanceForm.value,
                poown: poown,
              };
              let byte = registerNodeBuilder(data, this.keyringServ);

              return this.transactionServ.postTransaction(byte);
            })
            .then(() => {
              Swal.fire('Success', 'success', 'success');

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
