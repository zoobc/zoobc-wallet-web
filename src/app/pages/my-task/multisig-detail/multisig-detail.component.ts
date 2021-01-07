import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { getTranslation } from 'src/helpers/utils';
import Swal from 'sweetalert2';
import zoobc, {
  AccountBalance,
  MultiSigInterface,
  multisigPendingDetail,
  MultisigPendingListParams,
  MultisigPostTransactionResponse,
  signTransactionHash,
  ZBCTransaction,
} from 'zbc-sdk';

@Component({
  selector: 'app-multisig-detail',
  templateUrl: './multisig-detail.component.html',
  styleUrls: ['./multisig-detail.component.scss'],
})
export class MultisigDetailComponent implements OnInit, OnChanges {
  @Input() detail: ZBCTransaction;

  canSign: boolean = true;
  alreadySigned: boolean = false;
  enableSign: boolean = false;
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
  accountBalance: AccountBalance;

  participants: string[];

  constructor(private dialog: MatDialog, private authServ: AuthService, private translate: TranslateService) {
    this.account = this.authServ.getCurrAccount();
    // console.log(this.account.participants);

    this.form = new FormGroup({
      fee: this.feeForm,
    });
  }

  ngOnInit() {
    // console.log(this.detail.sender.value);
    // this.getMultisigDetail(this.detail.transactionHash);
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentDetail = changes.detail.currentValue.transactionHash;
    const prevDetail = changes.detail.previousValue && changes.detail.previousValue.transactionHash;
    if (currentDetail != prevDetail) {
      this.getMultisigDetail(this.detail.transactionHash);

      // console.log(this.canSign);
    }
  }

  getMultisigDetail(txHash) {
    this.isLoading = true;
    this.isError = false;
    zoobc.MultiSignature.getPendingByTxHash(txHash).then((multisig: multisigPendingDetail) => {
      this.minSignature = multisig.multisignatureinfo.minimumsignatures;
      this.totalSignature = multisig.pendingsignaturesList.length;
      this.multisig = multisig;

      // this.multiSigDetail = res.pendingtransaction;
      // this.detailMultisig.emit(this.multiSigDetail);
      const pendingSignatures = multisig.pendingsignaturesList;

      const totalParticpants = multisig.multisignatureinfo.addressesList.length;
      this.participants = multisig.multisignatureinfo.addressesList.map(res => res.value);
      const acc = this.authServ
        .getAllAccount()
        .filter(res => this.participants.includes(res.address.value))
        .map(res => res.address.value);
      const acc2 = pendingSignatures.map(res => res.accountaddress.value);
      // console.log(acc);
      const acc3 = acc.filter(res => acc2.includes(res));
      // console.log(acc3);

      // console.log(this.participants);
      if (pendingSignatures.length > 0) {
        for (let i = 0; i < pendingSignatures.length; i++) {
          this.participants = this.participants.filter(
            res => res != pendingSignatures[i].accountaddress.value
          );
        }
        // console.log(this.participants);
      } else {
        // const idx = this.authServ
        //   .getAllAccount()
        //   .filter(res => this.participants.includes(res.address.value));
        // if (idx.length > 0) this.canSign = true;
        // else this.canSign = false;
        // console.log(idx);
      }
      const idx = this.authServ.getAllAccount().filter(res => this.participants.includes(res.address.value));
      if (idx.length > 0) this.canSign = true;
      else this.canSign = false;
      // console.log(idx);

      // console.log(this.canSign);

      this.isLoading = false;

      this.canSign = this.canItSigned(this.multisig);
      this.alreadySigned = this.isAlreadySigned(this.multisig);
    });
  }

  onEnableSign() {
    this.enableSign = !this.enableSign;
  }

  canItSigned(multisig: multisigPendingDetail): boolean {
    // console.log(multisig);

    // const pendingSignatures = multisig.pendingsignaturesList;
    // if (pendingSignatures.length > 0) {
    //   for (let i = 0; i < pendingSignatures.length; i++) {
    //     this.participants = this.participants.filter(res => res != pendingSignatures[i].accountaddress.value);
    //   }
    // }

    const participants = multisig.multisignatureinfo.addressesList.map(res => res.value);
    const addresses = this.authServ
      .getAllAccount()
      // .filter(res => res.address.value != pendingSignatures[i].accountaddress.value)
      .filter(address => participants.includes(address.address.value));
    // console.log(addresses);

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
    if (result.length > 0) return true;
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

        let data: MultiSigInterface = {
          accountAddress: this.account.address,
          fee: this.feeForm.value,
          signaturesInfo: {
            txHash: this.detail.transactionHash,
            participants: [
              {
                address: this.account.address,
                signature: signTransactionHash(this.detail.transactionHash, seed),
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

            // this.pendingListMultiSig = this.pendingListMultiSig.filter(
            //   tx => tx.transactionHash != this.multiSigDetail.transactionHash
            // );
          })
          .catch(err => {
            console.log(err.message);
            let message = getTranslation(err.message, this.translate);
            Swal.fire('Opps...', message, 'error');
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    });
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
    // this.authServ.switchAccount(account);
  }
}
