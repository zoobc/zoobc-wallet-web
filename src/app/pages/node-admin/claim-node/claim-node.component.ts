import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { PoownService } from 'src/app/services/poown.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { isPubKeyValid } from 'src/helpers/utils';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import Swal from 'sweetalert2';
import {
  ClaimNodeInterface,
  claimNodeBuilder,
} from 'src/helpers/transaction-builder/claim-node';

@Component({
  selector: 'app-claim-node',
  templateUrl: './claim-node.component.html',
  styleUrls: ['./claim-node.component.scss'],
})
export class ClaimNodeComponent implements OnInit {
  formClaimNode: FormGroup;
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
    public dialogRef: MatDialogRef<ClaimNodeComponent>
  ) {
    this.formClaimNode = new FormGroup({
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

  onClaimNode() {
    if (this.formClaimNode.valid) {
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
              let data: ClaimNodeInterface = {
                accountAddress: this.account.address,
                nodePublicKey: this.nodePublicKeyForm.value,
                fee: this.feeForm.value,
                poown: poown,
              };
              let bytes = claimNodeBuilder(data, this.keyringServ);

              return this.transactionServ.postTransaction(bytes);
            })
            .then(() => {
              Swal.fire('Success', 'Your node will be claimed soon', 'success');
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
