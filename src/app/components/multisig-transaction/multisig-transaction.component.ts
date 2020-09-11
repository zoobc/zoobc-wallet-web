import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import zoobc, {
  toGetPendingList,
  MultiSigInterface,
  signTransactionHash,
  MultisigPendingTxDetailResponse,
  MultisigPostTransactionResponse,
  MultisigPendingTxResponse,
} from 'zoobc-sdk';
import { base64ToHex, getTranslation, truncate } from 'src/helpers/utils';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';

@Component({
  selector: 'app-multisig-transaction',
  templateUrl: './multisig-transaction.component.html',
  styleUrls: ['./multisig-transaction.component.scss'],
})
export class MultisigTransactionComponent implements OnInit {
  @ViewChild('detailMultisig') detailMultisigDialog: TemplateRef<any>;
  @Input() pendingListMultiSig;
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Input() withDetail: boolean = false;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  detailMultisigRefDialog: MatDialogRef<any>;

  multiSigDetail: any;
  isLoadingDetail: boolean = false;
  isLoadingTx: boolean = false;
  account;

  form: FormGroup;
  minFee = environment.fee;
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  // feeFormCurr = new FormControl('', Validators.required);
  // typeFeeField = new FormControl('ZBC');

  // currencyRate: Currency;
  advancedMenu: boolean = false;
  showSignForm: boolean = false;
  enabledSign: boolean = true;
  pendingSignatures = [];
  participants = [];
  totalParticpants: number;

  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private authServ: AuthService
  ) // private currencyServ: CurrencyRateService
  {
    this.form = new FormGroup({
      fee: this.feeForm,
      // feeCurr: this.feeFormCurr,
      // typeFee: this.typeFeeField,
    });
  }

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    // const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
    //   this.currencyRate = rate;
    //   const minCurrency = truncate(this.minFee * rate.value, 8);
    //   this.feeFormCurr.patchValue(minCurrency);
    //   this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
    // });
  }

  ngOnDestroy() {
    this.authServ.switchMultisigAccount();
  }

  onRefresh() {
    this.refresh.emit(true);
  }

  openDetailMultiSignature(txHash) {
    this.showSignForm = false;
    const hashHex = base64ToHex(txHash);
    this.isLoadingDetail = true;
    zoobc.MultiSignature.getPendingByTxHash(hashHex).then((res: MultisigPendingTxDetailResponse) => {
      const list = [];
      list.push(res.pendingtransaction);
      const tx: MultisigPendingTxResponse = {
        count: 1,
        page: 1,
        pendingtransactionsList: list,
      };
      const txFilter = toGetPendingList(tx);
      this.multiSigDetail = txFilter.pendingtransactionsList[0];

      this.pendingSignatures = res.pendingsignaturesList;
      this.participants = res.multisignatureinfo.addressesList;
      this.totalParticpants = res.multisignatureinfo.addressesList.length;
      if (this.pendingSignatures) {
        for (let i = 0; i < this.pendingSignatures.length; i++) {
          this.participants = this.participants.filter(
            res => res != this.pendingSignatures[i].accountaddress
          );
        }
        const idx = this.authServ.getAllAccount().filter(res => this.participants.includes(res.address));
        if (idx.length > 0) this.enabledSign = true;
        else this.enabledSign = false;
      }

      this.isLoadingDetail = false;
    });
    this.detailMultisigRefDialog = this.dialog.open(this.detailMultisigDialog, {
      width: '500px',
      maxHeight: '90vh',
    });
  }

  onIgnore() {
    this.closeDialog();
  }

  closeDialog() {
    this.detailMultisigRefDialog.close();
  }

  onAccept() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });
    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        const account = this.authServ.getCurrAccount();
        const seed = this.authServ.seed;
        this.isLoadingTx = true;
        let data: MultiSigInterface = {
          accountAddress: account.address,
          fee: this.feeForm.value,
          signaturesInfo: {
            txHash: this.multiSigDetail.transactionhash,
            participants: [
              {
                address: account.address,
                signature: signTransactionHash(this.multiSigDetail.transactionhash, seed),
              },
            ],
          },
        };
        zoobc.MultiSignature.postTransaction(data, seed)
          .then((res: MultisigPostTransactionResponse) => {
            let message = getTranslation('transaction has been accepted', this.translate);
            Swal.fire({
              type: 'success',
              title: message,
              showConfirmButton: false,
              timer: 1500,
            });

            this.pendingListMultiSig = this.pendingListMultiSig.filter(
              tx => tx.transactionhash != this.multiSigDetail.transactionhash
            );
          })
          .catch(err => {
            console.log(err.message);
            let message = getTranslation('an error occurred while processing your request', this.translate);
            Swal.fire('Opps...', message, 'error');
          })
          .finally(() => {
            this.isLoadingTx = false;
            this.closeDialog();
          });
      }
    });
  }

  toogleShowSignForm() {
    this.showSignForm = !this.showSignForm;
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.authServ.switchAccount(account);
  }
}
