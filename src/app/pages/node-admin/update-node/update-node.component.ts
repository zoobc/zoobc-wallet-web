import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Swal from 'sweetalert2';
import zoobc, { UpdateNodeInterface, ZBCAddressToBytes } from 'zoobc-sdk';
import { NodeAdminService } from 'src/app/services/node-admin.service';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation, truncate } from 'src/helpers/utils';
import { environment } from 'src/environments/environment';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';

@Component({
  selector: 'app-update-node',
  templateUrl: './update-node.component.html',
})
export class UpdateNodeComponent implements OnInit {
  minFee = environment.fee;
  formUpdateNode: FormGroup;
  ipAddressForm = new FormControl('', [Validators.required, Validators.pattern('^https?://+[\\w.-]+:\\d+$')]);
  lockedAmountForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  typeFeeField = new FormControl('ZBC');
  nodePublicKeyForm = new FormControl('', Validators.required);

  account: SavedAccount;

  isLoading: boolean = false;
  isError: boolean = false;

  currencyRate: Currency;

  constructor(
    private authServ: AuthService,
    private NodeAdminServ: NodeAdminService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<UpdateNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public node: any,
    private translate: TranslateService,
    private currencyServ: CurrencyRateService
  ) {
    this.formUpdateNode = new FormGroup({
      ipAddress: this.ipAddressForm,
      lockedAmount: this.lockedAmountForm,
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      typeFee: this.typeFeeField,
      nodePublicKey: this.nodePublicKeyForm,
    });

    this.account = authServ.getCurrAccount();
    this.ipAddressForm.patchValue(this.account.nodeIP);
    this.nodePublicKeyForm.patchValue(this.node.nodepublickey);
    this.lockedAmountForm.patchValue(parseInt(this.node.lockedbalance) / 1e8);

    this.lockedAmountForm.setValidators([
      Validators.required,
      Validators.min(parseInt(this.node.lockedbalance) / 1e8),
    ]);
  }

  ngOnInit() {
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      this.feeFormCurr.patchValue(minCurrency);
      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
  }

  onChangeNodePublicKey() {
    let isValid = ZBCAddressToBytes(this.nodePublicKeyForm.value);
    if (!isValid) this.nodePublicKeyForm.setErrors({ invalidAddress: true });
  }

  onUpdateNode() {
    if (this.formUpdateNode.valid) {
      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
        maxHeight: '90vh',
      });

      pinRefDialog.afterClosed().subscribe(isPinValid => {
        if (isPinValid) {
          this.isLoading = true;
          this.isError = false;

          let data: UpdateNodeInterface = {
            accountAddress: this.account.address,
            fee: this.feeForm.value,
            nodePublicKey: ZBCAddressToBytes(this.nodePublicKeyForm.value),
            nodeAddress: this.ipAddressForm.value,
            funds: this.lockedAmountForm.value,
          };

          zoobc.Node.update(data, this.authServ.seed)
            .then(() => {
              let message = getTranslation('your node will be updated soon', this.translate);
              Swal.fire('Success', message, 'success');

              // change IP if has different value
              if (this.ipAddressForm.value != this.account.nodeIP)
                this.NodeAdminServ.editIpAddress(this.ipAddressForm.value);

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
