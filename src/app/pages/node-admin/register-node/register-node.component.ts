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
import zoobc, { RegisterNodeInterface } from 'zoobc-sdk';

@Component({
  selector: 'app-register-node',
  templateUrl: './register-node.component.html',
  styleUrls: ['./register-node.component.scss'],
})
export class RegisterNodeComponent implements OnInit {
  formRegisterNode: FormGroup;
  ipAddressForm = new FormControl('', [
    Validators.required,
    Validators.pattern('^[\\w.-]+:\\d+$'),
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

  onChangeNodePublicKey() {
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

          let data: RegisterNodeInterface = {
            accountAddress: this.account.address,
            nodePublicKey: this.nodePublicKeyForm.value,
            nodeAddress: this.ipAddressForm.value,
            fee: this.feeForm.value,
            funds: this.lockedBalanceForm.value,
          };

          zoobc.Node.register(data, this.authServ.getSeed)
            .then(() => {
              Swal.fire(
                'Success',
                'Your node will be registered soon',
                'success'
              );

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
