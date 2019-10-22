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
  ownerForm = new FormControl('', Validators.required);
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
      owner: this.ownerForm,
      ipAddress: this.ipAddressForm,
      lockedBalance: this.lockedBalanceForm,
      fee: this.feeForm,
      nodePublicKey: this.nodePublicKeyForm,
    });

    this.account = authServ.getCurrAccount();
  }

  ngOnInit() {
    this.isLoading = true;
    this.formRegisterNode.disable();
    this.poownServ.get(this.account.nodeIP).then(
      res => {
        this.isLoading = false;
        this.poown = res;
        let address = res.toString('utf-8', 0, 44);
        if (this.account.address == address) {
          this.formRegisterNode.enable();
          this.ipAddressForm.patchValue(this.account.nodeIP);
        } else {
          this.isError = true;
          this.formRegisterNode.disable();
        }
      },
      err => {
        this.isError = true;
        this.formRegisterNode.disable();
        console.log(err);
      }
    );
  }

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

          let data: RegisterNodeInterface = {
            accountAddress: this.account.address,
            nodePublicKey: this.nodePublicKeyForm.value,
            nodeAddress: this.ipAddressForm.value,
            fee: this.feeForm.value,
            funds: this.lockedBalanceForm.value,
            poown: this.poown,
          };
          let byte = registerNodeBuilder(data, this.keyringServ);

          this.transactionServ.postTransaction(byte).then(
            (res: any) => {
              Swal.fire('Success', 'success', 'success');
              this.isLoading = false;
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
