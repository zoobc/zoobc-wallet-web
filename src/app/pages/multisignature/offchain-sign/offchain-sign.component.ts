import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MultiSigDraft } from 'src/app/services/multisig.service';
import { generateTransactionHash, isZBCAddressValid, signTransactionHash, toBase64Url } from 'zoobc-sdk';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { onCopyText, getTranslation, getPrefixAddress } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { getTxType } from 'src/helpers/multisig-utils';

@Component({
  selector: 'app-offchain-sign',
  templateUrl: './offchain-sign.component.html',
  styleUrls: ['./offchain-sign.component.scss'],
})
export class OffchainSignComponent {
  yourTxHash: string;
  isValid: boolean = false;
  isAddressInParticipants: boolean;

  signature: string;
  signatureUrl: string;

  draft: MultiSigDraft;
  innerTx: any[] = [];
  txType: string = '';

  account: SavedAccount;
  participants: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: MultiSigDraft,
    private authServ: AuthService,
    private snackbar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.draft = data;
    this.txType = getTxType(data.txType);
    this.participants = data.multisigInfo.participants;
    this.innerTx = Object.keys(this.draft.txBody).map(key => {
      const item = this.draft.txBody;
      const prefix = getPrefixAddress(item[key]);
      return {
        key,
        value: item[key],
        isAddress: isZBCAddressValid(item[key], prefix),
      };
    });
  }

  onVerify() {
    const { txHash } = this.draft.signaturesInfo;
    this.yourTxHash = generateTransactionHash(Buffer.from(this.draft.unisgnedTransactions));
    this.isValid = this.yourTxHash == txHash ? true : false;

    if (this.isValid) {
      let accounts = this.authServ.getAllAccount();
      accounts = accounts.filter(res => this.participants.includes(res.address));
      if (accounts.length > 0) this.isAddressInParticipants = true;
      else this.isAddressInParticipants = false;
    }
  }

  onSign() {
    const seed = this.authServ.seed;
    this.signature = signTransactionHash(this.yourTxHash, seed).toString('base64');

    const signatureBase64Url = toBase64Url(this.signature);
    this.signatureUrl = `${window.location.origin}/sign/${this.yourTxHash}/${signatureBase64Url}`;
  }

  async onCopy() {
    onCopyText(this.signatureUrl);
    let message = await getTranslation('Signature copied to clipboard', this.translate);
    this.snackbar.open(message, null, { duration: 3000 });
  }
}
