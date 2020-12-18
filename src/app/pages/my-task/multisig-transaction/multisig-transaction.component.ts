import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import zoobc, {
  MultiSigInterface,
  signTransactionHash,
  MultisigPostTransactionResponse,
  multisigPendingDetail,
  ZBCTransaction,
} from 'zbc-sdk';
import { getTranslation } from 'src/helpers/utils';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-multisig-transaction',
  templateUrl: './multisig-transaction.component.html',
  styleUrls: ['./multisig-transaction.component.scss'],
})
export class MultisigTransactionComponent implements OnInit {
  @Input() pendingListMultiSig;
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Input() withDetail: boolean = false;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  @Output() detailMultisig: EventEmitter<ZBCTransaction> = new EventEmitter();
  @Output() dismiss: EventEmitter<boolean> = new EventEmitter();

  multiSigDetail: any;
  isLoadingDetail: boolean = false;
  isLoadingConfirmTx: boolean = false;
  account;

  form: FormGroup;
  minFee = environment.fee;
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);

  advancedMenu: boolean = false;
  showSignForm: boolean = false;
  enabledSign: boolean = true;
  pendingSignatures = [];
  participants = [];
  totalParticpants: number;

  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private authServ: AuthService,
    @Inject(DOCUMENT) private document
  ) {
    this.form = new FormGroup({
      fee: this.feeForm,
    });
  }

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
  }

  onRefresh() {
    this.refresh.emit(true);
  }

  openDetailMultiSignature(txHash) {
    this.showSignForm = false;
    this.isLoadingDetail = true;
    zoobc.MultiSignature.getPendingByTxHash(txHash).then((res: multisigPendingDetail) => {
      this.multiSigDetail = res.pendingtransaction;
      this.detailMultisig.emit(this.multiSigDetail);
      this.pendingSignatures = res.pendingsignaturesList;
      this.participants = res.multisignatureinfo.addressesList;
      this.participants = this.participants.map(res => res.value);
      this.totalParticpants = res.multisignatureinfo.addressesList.length;
      if (this.pendingSignatures.length > 0) {
        for (let i = 0; i < this.pendingSignatures.length; i++) {
          this.participants = this.participants.filter(
            res => res != this.pendingSignatures[i].accountaddress.value
          );
        }
        const idx = this.authServ
          .getAllAccount()
          .filter(res => this.participants.includes(res.address.value));
        if (idx.length > 0) this.enabledSign = true;
        else this.enabledSign = false;
      } else {
        const idx = this.authServ
          .getAllAccount()
          .filter(res => this.participants.includes(res.address.value));
        if (idx.length > 0) this.enabledSign = true;
        else this.enabledSign = false;
      }
      this.isLoadingDetail = false;
    });
  }

  onAccept() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });
    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        const seed = this.authServ.seed;
        this.isLoadingConfirmTx = true;

        let data: MultiSigInterface = {
          accountAddress: this.account.address,
          fee: this.feeForm.value,
          signaturesInfo: {
            txHash: this.multiSigDetail.transactionHash,
            participants: [
              {
                address: this.account.address,
                signature: signTransactionHash(this.multiSigDetail.transactionHash, seed),
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
              tx => tx.transactionHash != this.multiSigDetail.transactionHash
            );
          })
          .catch(err => {
            console.log(err.message);
            let message = getTranslation(err.message, this.translate);
            Swal.fire('Opps...', message, 'error');
          })
          .finally(() => {
            this.isLoadingConfirmTx = false;
            this.onDismiss();
          });
      }
    });
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    this.authServ.switchAccount(account, true);
  }

  onDismiss() {
    this.dismiss.emit(true);
  }
}
