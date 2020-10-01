import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import Swal from 'sweetalert2';
import zoobc, { ZBCAddressToBytes, ClaimNodeInterface } from 'zoobc-sdk';
import { getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-claim-node',
  templateUrl: './claim-node.component.html',
})
export class ClaimNodeComponent implements OnInit {
  minFee = environment.fee;
  formClaimNode: FormGroup;
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  typeFeeField = new FormControl('ZBC');
  nodePublicKeyForm = new FormControl('', Validators.required);
  ipAddressForm = new FormControl('', [Validators.required, Validators.pattern('^https?://+[\\w.-]+:\\d+$')]);
  account: SavedAccount;
  isLoading: boolean = false;
  isError: boolean = false;
  claimNodeForm = {
    fee: 'fee',
    feeCurr: 'feeCurr',
    typeFee: 'typeFee',
    nodePublicKey: 'nodePublicKey',
    ipAddress: 'ipAddress',
  };

  constructor(
    private authServ: AuthService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ClaimNodeComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public myNodePubKey: string
  ) {
    this.formClaimNode = new FormGroup({
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      typeFee: this.typeFeeField,
      nodePublicKey: this.nodePublicKeyForm,
      ipAddress: this.ipAddressForm,
    });

    this.account = authServ.getCurrAccount();
    this.ipAddressForm.patchValue(this.account.nodeIP);
  }

  ngOnInit() {
    if (this.myNodePubKey) this.nodePublicKeyForm.patchValue(this.myNodePubKey);
  }

  onClaimNode() {
    if (this.formClaimNode.valid) {
      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
        maxHeight: '90vh',
      });
      pinRefDialog.afterClosed().subscribe(isPinValid => {
        if (isPinValid) {
          const data: ClaimNodeInterface = {
            accountAddress: this.account.address,
            nodePublicKey: ZBCAddressToBytes(this.nodePublicKeyForm.value),
            fee: this.feeForm.value,
            nodeAddress: this.ipAddressForm.value,
          };
          const seed = this.authServ.seed;

          zoobc.Node.claim(data, seed)
            .then(() => {
              let message = getTranslation('your node will be claimed soon', this.translate);
              Swal.fire('Success', message, 'success');
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
