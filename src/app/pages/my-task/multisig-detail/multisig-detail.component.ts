import { Component, Input, OnInit } from '@angular/core';
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
export class MultisigDetailComponent implements OnInit {
  @Input() detail: ZBCTransaction;

  canSign: boolean = true;
  enableSign: boolean = false;
  isLoading: boolean = false;
  isError: boolean = false;
  isLoadingApprove: boolean = false;

  form: FormGroup;
  minFee = environment.fee;
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);

  account: SavedAccount;
  accountBalance: AccountBalance;

  participants: string[];

  constructor(private dialog: MatDialog, private authServ: AuthService, private translate: TranslateService) {
    this.account = this.authServ.getCurrAccount();
    console.log(this.account.participants);

    this.form = new FormGroup({
      fee: this.feeForm,
    });
  }

  ngOnInit() {
    console.log(this.detail.sender.value);
    this.getMultisigDetail(this.detail.transactionHash);
  }

  getMultisigDetail(txHash) {
    // this.showSignForm = false;
    this.isLoading = true;
    this.isError = false;
    zoobc.MultiSignature.getPendingByTxHash(txHash).then((res: multisigPendingDetail) => {
      console.log(res);

      // this.multiSigDetail = res.pendingtransaction;
      // this.detailMultisig.emit(this.multiSigDetail);
      const pendingSignatures = res.pendingsignaturesList;
      const totalParticpants = res.multisignatureinfo.addressesList.length;
      this.participants = res.multisignatureinfo.addressesList.map(res => res.value);
      if (pendingSignatures.length > 0) {
        for (let i = 0; i < pendingSignatures.length; i++) {
          this.participants = this.participants.filter(
            res => res != pendingSignatures[i].accountaddress.value
          );
        }
        const idx = this.authServ
          .getAllAccount()
          .filter(res => this.participants.includes(res.address.value));
        if (idx.length > 0) this.canSign = true;
        else this.canSign = false;
      } else {
        const idx = this.authServ
          .getAllAccount()
          .filter(res => this.participants.includes(res.address.value));
        if (idx.length > 0) this.canSign = true;
        else this.canSign = false;
      }
      this.isLoading = false;
    });
  }

  onEnableSign() {
    this.enableSign = !this.enableSign;
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
