import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import Swal from 'sweetalert2';
import zoobc, { RemoveNodeInterface, ZBCAddressToBytes } from 'zoobc-sdk';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation, truncate } from 'src/helpers/utils';
import { environment } from 'src/environments/environment';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';
@Component({
  selector: 'app-remove-node',
  templateUrl: './remove-node.component.html',
})
export class RemoveNodeComponent implements OnInit {
  minFee = environment.fee;
  formRemoveNode: FormGroup;
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
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RemoveNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public node: any,
    private translate: TranslateService,
    private currencyServ: CurrencyRateService
  ) {
    this.formRemoveNode = new FormGroup({
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      typeFee: this.typeFeeField,
      nodePublicKey: this.nodePublicKeyForm,
    });

    this.account = authServ.getCurrAccount();
    this.nodePublicKeyForm.patchValue(this.node.nodepublickey);
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

  onRemoveNode() {
    if (this.formRemoveNode.valid) {
      let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
        width: '400px',
        maxHeight: '90vh',
      });

      pinRefDialog.afterClosed().subscribe(isPinValid => {
        if (isPinValid) {
          this.isLoading = true;
          this.isError = false;

          let data: RemoveNodeInterface = {
            accountAddress: this.account.address,
            nodePublicKey: ZBCAddressToBytes(this.nodePublicKeyForm.value),
            fee: this.feeForm.value,
          };

          zoobc.Node.remove(data, this.authServ.seed)
            .then(() => {
              let message = getTranslation('your node will be removed soon', this.translate);
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
