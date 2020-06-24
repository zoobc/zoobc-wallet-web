import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import zoobc, { toGetPendingList, MultiSigInterface, signTransactionHash } from 'zoobc-sdk';
import { base64ToHex, getTranslation } from 'src/helpers/utils';

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

  constructor(public dialog: MatDialog, private translate: TranslateService, private authServ: AuthService) {}

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
  }

  onRefresh() {
    this.refresh.emit(true);
  }

  openDetailMultiSignature(txHash) {
    const hashHex = base64ToHex(txHash);
    this.isLoadingDetail = true;
    zoobc.MultiSignature.getPendingByTxHash(hashHex).then(res => {
      const list = [];
      list.push(res.pendingtransaction);
      const tx = {
        count: 1,
        page: 1,
        pendingtransactionsList: list,
      };
      const txFilter = toGetPendingList(tx);
      this.multiSigDetail = txFilter.pendingtransactionsList[0];
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
    const account = this.authServ.getCurrAccount();
    const seed = this.authServ.seed;

    this.isLoadingTx = true;
    let data: MultiSigInterface = {
      accountAddress: account.signByAddress,
      fee: this.multiSigDetail.fee,
      signaturesInfo: {
        txHash: this.multiSigDetail.transactionhash,
        participants: [
          {
            address: account.signByAddress,
            signature: signTransactionHash(this.multiSigDetail.transactionhash, seed),
          },
        ],
      },
    };

    zoobc.MultiSignature.postTransaction(data, seed)
      .then(async (res: any) => {
        let message = await getTranslation('Transaction has been accepted', this.translate);
        Swal.fire({
          type: 'success',
          title: message,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(async err => {
        console.log(err.message);
        let message = await getTranslation('An error occurred while processing your request', this.translate);
        Swal.fire('Opps...', message, 'error');
      })
      .finally(() => {
        this.isLoadingTx = false;
        this.closeDialog();
        this.onRefresh();
      });
  }
}
