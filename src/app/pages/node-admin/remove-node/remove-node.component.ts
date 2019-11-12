import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { PoownService } from 'src/app/services/poown.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { isPubKeyValid } from 'src/helpers/utils';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import {
  ClaimNodeInterface,
  claimNodeBuilder,
} from 'src/helpers/transaction-builder/claim-node';
import Swal from 'sweetalert2';
import {
  RemoveNodeInterface,
  removeNodeBuilder,
} from 'src/helpers/transaction-builder/remove-node';
import { TransactionService } from 'src/app/services/transaction.service';

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
    private poownServ: PoownService,
    private transactionServ: TransactionService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RemoveNodeComponent>
  ) {
    this.formRemoveNode = new FormGroup({
      fee: this.feeForm,
      nodePublicKey: this.nodePublicKeyForm,
    });

    this.account = authServ.getCurrAccount();
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
          let bytes = removeNodeBuilder(data, this.keyringServ);

          this.transactionServ
            .postTransaction(bytes)
            .then(() => {
              Swal.fire('Success', 'success', 'success');
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
