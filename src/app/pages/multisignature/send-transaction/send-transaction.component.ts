import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';
import { truncate, getTranslation } from 'src/helpers/utils';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import zoobc, { MultiSigInterface } from 'zoobc-sdk';

@Component({
  selector: 'app-send-transaction',
  templateUrl: './send-transaction.component.html',
  styleUrls: ['./send-transaction.component.scss'],
})
export class SendTransactionComponent implements OnInit {
  @ViewChild('confirmDialog') confirmDialog: TemplateRef<any>;
  confirmRefDialog: MatDialogRef<any>;

  subscription: Subscription = new Subscription();

  account: SavedAccount;
  formSend: FormGroup;
  minFee = environment.fee;
  feeForm = new FormControl(this.minFee * 2, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  timeoutField = new FormControl('0');

  currencyRate: Currency;
  kindFee: string;
  advancedMenu: boolean = false;

  multisig: MultiSigDraft;
  multisigSubs: Subscription;
  multiSigDrafts: MultiSigDraft[];

  feeSlow = environment.fee;
  feeMedium = this.feeSlow * 2;
  feeFast = this.feeMedium * 2;
  typeFee: number;
  customFeeValues: number;

  constructor(
    private authServ: AuthService,
    private currencyServ: CurrencyRateService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private router: Router,
    private multisigServ: MultisigService,
    private location: Location
  ) {
    this.formSend = new FormGroup({
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      timeout: this.timeoutField,
    });
  }

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);

    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo } = multisig;
      if (multisigInfo === undefined) this.router.navigate(['/multisignature']);

      this.multisig = multisig;
      const { accountAddress, fee } = this.multisig;
      this.account.address = accountAddress;
      this.feeForm.setValue(multisig.fee);
      this.feeFormCurr.setValue(multisig.fee * this.currencyRate.value);
      this.timeoutField.setValue('0');
      if (fee === this.feeSlow) {
        this.typeFee = 1;
        this.kindFee = 'Slow';
      } else if (fee === this.feeMedium) {
        this.typeFee = 2;
        this.kindFee = 'Average';
      } else if (fee === this.feeFast) {
        this.typeFee = 3;
        this.kindFee = 'Fast';
      } else {
        this.customFeeValues = multisig.fee;
        this.kindFee = 'Custom';
      }
    });
    this.getMultiSigDraft();
  }

  getMultiSigDraft() {
    this.multiSigDrafts = this.multisigServ.getDrafts();
  }

  saveDraft() {
    this.updateSendTransaction();
    const isDraft = this.multiSigDrafts.some(draft => draft.id == this.multisig.id);
    if (isDraft) {
      this.multisigServ.editDraft();
    } else {
      this.multisigServ.saveDraft();
    }
    this.router.navigate(['/multisignature']);
  }

  updateSendTransaction() {
    const { fee } = this.formSend.value;
    const multisig = { ...this.multisig };
    multisig.accountAddress = this.account.address;
    multisig.fee = fee;
    this.multisigServ.update(multisig);
  }

  back() {
    this.location.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.multisigSubs.unsubscribe();
  }

  onClickFeeChoose(value) {
    this.kindFee = value;
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
  }

  onOpenConfirmDialog() {
    this.confirmRefDialog = this.dialog.open(this.confirmDialog, {
      width: '500px',
      maxHeight: '90vh',
    });
  }
  onConfirm() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });

    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        this.confirmRefDialog.close();
        this.onSendMultiSignatureTransaction();
      }
    });
  }

  async onSendMultiSignatureTransaction() {
    this.updateSendTransaction();
    let data: MultiSigInterface = {
      accountAddress: this.multisig.accountAddress,
      fee: this.multisig.fee,
      multisigInfo: this.multisig.multisigInfo,
      unisgnedTransactions: this.multisig.unisgnedTransactions,
      signaturesInfo: this.multisig.signaturesInfo,
    };
    const childSeed = this.authServ.seed;
    zoobc.MultiSignature.postTransaction(data, childSeed)
      .then(async (res: any) => {
        let message = await getTranslation('Your Transaction is processing', this.translate);
        let subMessage = await getTranslation('You send coins to', this.translate, {
          amount: data.unisgnedTransactions.amount,
          currencyValue: truncate(data.unisgnedTransactions.amount * this.currencyRate.value, 2),
          currencyName: this.currencyRate.name,
          recipient: data.unisgnedTransactions.recipient,
        });
        this.multisigServ.deleteDraft(this.multisig.id);
        Swal.fire(message, subMessage, 'success');
        this.router.navigateByUrl('/dashboard');
      })
      .catch(async err => {
        console.log(err.message);
        let message = await getTranslation('An error occurred while processing your request', this.translate);
        Swal.fire('Opps...', message, 'error');
      });
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
