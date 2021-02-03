import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { getTranslation } from 'src/helpers/utils';
import Swal from 'sweetalert2';
import zoobc, {
  MultiSigInterface,
  multisigPendingDetail,
  MultisigPostTransactionResponse,
  signTransactionHash,
} from 'zbc-sdk';

@Component({
  selector: 'app-multisig-detail',
  templateUrl: './multisig-detail.component.html',
  styleUrls: ['./multisig-detail.component.scss'],
})
export class MultisigDetailComponent implements OnChanges {
  @Input() txHash: string;
  @Output() dismiss: EventEmitter<boolean> = new EventEmitter();

  canSign: boolean = true;
  alreadySigned: boolean = false;

  isLoading: boolean = false;
  isError: boolean = false;
  isLoadingApprove: boolean = false;

  minSignature: number;
  totalSignature: number;

  multisig: multisigPendingDetail;

  form: FormGroup;
  minFee = environment.fee;
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);

  account: SavedAccount;
  participants: string[];

  mutisigMap = {
    fee: 'fee',
  };

  constructor(private dialog: MatDialog, private authServ: AuthService, private translate: TranslateService) {
    this.account = this.authServ.getCurrAccount();

    this.form = new FormGroup({
      fee: this.feeForm,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentDetail = changes.txHash.currentValue;
    const prevDetail = changes.txHash.previousValue;
    if (currentDetail != prevDetail) this.getMultisigDetail(this.txHash);
  }

  getMultisigDetail(txHash) {
    this.isLoading = true;
    this.isError = false;
    zoobc.MultiSignature.getPendingByTxHash(txHash).then((multisig: multisigPendingDetail) => {
      this.isLoading = false;
      this.minSignature = multisig.multisignatureinfo.minimumsignatures;
      this.totalSignature = multisig.pendingsignaturesList.length;
      this.multisig = multisig;

      const pendingSignatures = multisig.pendingsignaturesList.map(sign => sign.accountaddress.value);
      const participants = multisig.multisignatureinfo.addressesList.map(res => res.value);
      this.participants = participants.filter(participant => !pendingSignatures.includes(participant));

      this.canSign = this.canItSigned(this.multisig);
      this.alreadySigned = this.isAlreadySigned(this.multisig);
    });
  }

  canItSigned(multisig: multisigPendingDetail): boolean {
    const participants = multisig.multisignatureinfo.addressesList.map(res => res.value);
    const addresses = this.authServ
      .getAllAccount()
      .filter(address => participants.includes(address.address.value));

    if (addresses.length > 0) return true;
    else return false;
  }

  isAlreadySigned(multisig: multisigPendingDetail): boolean {
    const pendingSignatures = multisig.pendingsignaturesList;
    const participants = multisig.multisignatureinfo.addressesList.map(res => res.value);

    const addresses = this.authServ
      .getAllAccount()
      .filter(res => participants.includes(res.address.value))
      .map(res => res.address.value);
    const pendingSignAddresses = pendingSignatures.map(res => res.accountaddress.value);
    const result = addresses.filter(res => pendingSignAddresses.includes(res));

    if (result.length >= addresses.length) return true;
    return false;
  }

  onAccept() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });
    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        const seed = this.authServ.seed;
        this.isLoading = true;
        this.isError = false;

        let data: MultiSigInterface = {
          accountAddress: this.account.address,
          fee: this.feeForm.value,
          signaturesInfo: {
            txHash: this.multisig.pendingtransaction.transactionHash,
            participants: [
              {
                address: this.account.address,
                signature: signTransactionHash(this.multisig.pendingtransaction.transactionHash, seed),
              },
            ],
          },
        };
        zoobc.MultiSignature.postTransaction(data, seed)
          .then((res: MultisigPostTransactionResponse) => {
            this.isLoading = false;
            let message = getTranslation('transaction has been accepted', this.translate);
            Swal.fire({
              type: 'success',
              title: message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.onDismiss();

            // this.pendingListMultiSig = this.pendingListMultiSig.filter(
            //   tx => tx.transactionHash != this.multiSigDetail.transactionHash
            // );
          })
          .catch(err => {
            console.log(err.message);
            this.isError = true;
            this.isLoading = false;
            const message = getTranslation(err.message, this.translate);
            Swal.fire('Opps...', message, 'error');
          });
      }
    });
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
  }

  onDismiss() {
    this.dismiss.emit(true);
  }
}
