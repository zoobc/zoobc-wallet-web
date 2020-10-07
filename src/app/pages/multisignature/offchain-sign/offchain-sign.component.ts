import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MultiSigDraft } from 'src/app/services/multisig.service';
import { generateTransactionHash, isZBCAddressValid, signTransactionHash } from 'zoobc-sdk';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { onCopyText, getTranslation } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { getTxType } from 'src/helpers/multisig-utils';

@Component({
  selector: 'app-offchain-sign',
  templateUrl: './offchain-sign.component.html',
  styleUrls: ['./offchain-sign.component.scss'],
})
export class OffchainSignComponent implements OnInit {
  yourTxHash: string;
  isValid: boolean = false;
  isAddressInParticipants: boolean;
  signature: string;

  draft: MultiSigDraft;
  innerTx: any[] = [];
  txType: string = '';

  account: SavedAccount;
  participants: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<OffchainSignComponent>,
    @Inject(MAT_DIALOG_DATA) private data: MultiSigDraft,
    private authServ: AuthService,
    private snackbar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.draft = data;
    this.txType = getTxType(data.txType);
    this.participants = data.multisigInfo.participants;
    this.innerTx = Object.keys(this.draft.txBody).map(key => {
      const item = this.draft.txBody;
      console.log(key);

      return {
        key,
        value: item[key],
        isAddress: isZBCAddressValid(item[key]),
      };
    });
    console.log(this.innerTx);
  }

  ngOnInit() {}

  onVerify() {
    const { txHash } = this.draft.signaturesInfo;
    this.yourTxHash = generateTransactionHash(Buffer.from(this.draft.unisgnedTransactions));
    this.isValid = this.yourTxHash == txHash ? true : false;

    if (this.isValid) {
      let accounts = this.authServ.getAllAccount();
      accounts = accounts.filter(res => this.participants.includes(res.address));
      console.log(accounts);
      if (accounts.length > 0) this.isAddressInParticipants = true;
      else this.isAddressInParticipants = false;
    }
  }

  onSign() {
    const seed = this.authServ.seed;
    // console.log(seed);

    const buff = signTransactionHash(this.yourTxHash, seed);
    // console.log(buff);

    this.signature = signTransactionHash(this.yourTxHash, seed).toString('base64');
    // console.log(this.signature);
    console.log(`${window.location.origin}/sign/${this.yourTxHash}/${this.signature}`);
  }

  async onCopy() {
    const account = this.authServ.getCurrAccount();
    const data = {
      // address: account.signByAddress,
      txHash: this.yourTxHash,
      signature: this.signature,
    };
    const string = `ZBC${Buffer.from(JSON.stringify(data)).toString('base64')}ZBC`;
    onCopyText(string);

    let message = await getTranslation('Signature copied to clipboard', this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
  }

  onSwitchAccount(account: SavedAccount) {
    // this.account = account;
    // this.authServ.switchAccount(account);
    //   if (!account) {
    //     this.isAddressInParticipants = false;
    //   } else this.isAddressInParticipants = true;
  }
}
