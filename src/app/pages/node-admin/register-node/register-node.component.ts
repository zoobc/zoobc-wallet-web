import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Swal from 'sweetalert2';
import zoobc, { RegisterNodeInterface, ZBCAddressToBytes } from 'zoobc-sdk';
import { NodeAdminService } from 'src/app/services/node-admin.service';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-register-node',
  templateUrl: './register-node.component.html',
})
export class RegisterNodeComponent implements OnInit {
  minFee = environment.fee;
  formRegisterNode: FormGroup;
  ipAddressForm = new FormControl('', [Validators.required, Validators.pattern('^https?://+[\\w.-]+:\\d+$')]);
  lockedBalanceForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  typeFeeField = new FormControl('ZBC');
  nodePublicKeyForm = new FormControl('', Validators.required);

  account: SavedAccount;
  poown: Buffer;
  isLoading: boolean = false;
  isError: boolean = false;

  registerNodeForm = {
    ipAddress: 'ipAddress',
    lockedBalance: 'lockedBalance',
    fee: 'fee',
    feeCurr: 'feeCurr',
    typeFee: 'typeFee',
    nodePublicKey: 'nodePublicKey',
  };

  constructor(
    private authServ: AuthService,
    private nodeAdminServ: NodeAdminService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<RegisterNodeComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public myNodePubKey: string
  ) {
    this.formRegisterNode = new FormGroup({
      ipAddress: this.ipAddressForm,
      lockedBalance: this.lockedBalanceForm,
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      typeFee: this.typeFeeField,
      nodePublicKey: this.nodePublicKeyForm,
    });

    this.account = authServ.getCurrAccount();
    this.ipAddressForm.patchValue(this.account.nodeIP);
  }

  ngOnInit() {
    if (this.myNodePubKey) this.nodePublicKeyForm.patchValue(this.myNodePubKey);
  }

  onRegisterNode() {
    if (this.formRegisterNode.valid) {
      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
        maxHeight: '90vh',
      });

      pinRefDialog.afterClosed().subscribe(isPinValid => {
        if (isPinValid) {
          this.isLoading = true;
          this.isError = false;

          let data: RegisterNodeInterface = {
            accountAddress: this.account.address,
            nodePublicKey: ZBCAddressToBytes(this.nodePublicKeyForm.value),
            nodeAddress: this.ipAddressForm.value,
            fee: this.feeForm.value,
            funds: this.lockedBalanceForm.value,
          };

          zoobc.Node.register(data, this.authServ.seed)
            .then(() => {
              let message = getTranslation('your node will be registered soon', this.translate);
              Swal.fire('Success', message, 'success');

              // change IP if has different value
              if (this.ipAddressForm.value != this.account.nodeIP)
                this.nodeAdminServ.editIpAddress(this.ipAddressForm.value);

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
