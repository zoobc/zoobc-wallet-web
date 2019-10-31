import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { NodeRegistrationService } from 'src/app/services/node-registration.service';
import { PoownService } from 'src/app/services/poown.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { isPubKeyValid } from 'src/helpers/utils';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { MatDialog } from '@angular/material';
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
  ipAddressForm = new FormControl('', Validators.required);
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
    private nodeServ: NodeRegistrationService,
    private poownServ: PoownService,
    private transactionServ: TransactionService,
    private dialog: MatDialog
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
            .get(this.account.nodeIP)
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
              console.log(byte);

              return this.transactionServ.postTransaction(byte);
            })
            .then(res => Swal.fire('Success', 'success', 'success'))
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
