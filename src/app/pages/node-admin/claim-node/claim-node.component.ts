import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { PoownService } from 'src/app/services/poown.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { MatDialog } from '@angular/material';
import { isPubKeyValid } from 'src/helpers/utils';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import Swal from 'sweetalert2';
import {
  ClaimNodeInterface,
  clamNodeBuilder,
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
  poown: Buffer;

  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private poownServ: PoownService,
    private transactionServ: TransactionService,
    private dialog: MatDialog
  ) {
    this.formClaimNode = new FormGroup({
      fee: this.feeForm,
      nodePublicKey: this.nodePublicKeyForm,
    });

    this.account = authServ.getCurrAccount();
  }

  ngOnInit() {
    this.isLoading = true;
    this.formClaimNode.disable();
    this.poownServ.get(this.account.nodeIP).then(
      res => {
        this.isLoading = false;
        this.poown = res;
        let address = res.toString('utf-8', 0, 44);
        if (this.account.address == address) {
          this.formClaimNode.enable();
        } else {
          this.isError = true;
          this.formClaimNode.disable();
        }
      },
      err => {
        this.isError = true;
        this.formClaimNode.disable();
        console.log(err);
      }
    );
  }

  onChangeRecipient() {
    let isValid = isPubKeyValid(this.nodePublicKeyForm.value);
    if (!isValid) this.nodePublicKeyForm.setErrors({ invalidAddress: true });
  }

  onClaimNode(e) {
    e.preventDefault();
    if (this.formClaimNode.valid) {
      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
      });

      pinRefDialog.afterClosed().subscribe(isPinValid => {
        if (isPinValid) {
          this.isLoading = true;
          this.isError = false;

          let data: ClaimNodeInterface = {
            accountAddress: this.account.address,
            nodePublicKey: this.nodePublicKeyForm.value,
            fee: this.feeForm.value,
            poown: this.poown,
          };

          let bytes = clamNodeBuilder(data, this.keyringServ);

          this.transactionServ.postTransaction(bytes).then(
            (res: any) => {
              console.log(res);
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
