import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TransactionService } from '../../services/transaction.service';
import { AppService } from '../../app.service';
import { AccountService } from '../../services/account.service';
import {
  bigintToByteArray,
  BigInt,
  addressToPublicKey,
} from '../../../helpers/converters';
import { transactionByte } from '../../../helpers/transactionByteTemplate';
import { BIP32Interface } from 'bip32';
import * as nacl from 'tweetnacl';

@Component({
  selector: 'app-sendmoney',
  templateUrl: './sendmoney.component.html',
  styleUrls: ['./sendmoney.component.css'],
})
export class SendmoneyComponent implements OnInit {
  formSend: FormGroup;
  recipientForm = new FormControl('', Validators.required);
  amountForm = new FormControl('', Validators.required);
  feeForm = new FormControl('', Validators.required);
  isFormSendLoading = false;

  constructor(
    private transactionServ: TransactionService,
    private appServ: AppService,
    private accServ: AccountService
  ) {
    this.formSend = new FormGroup({
      recipient: this.recipientForm,
      amount: this.amountForm,
      fee: this.feeForm,
    });
  }

  ngOnInit() {}

  async onSendMoney() {
    if (this.formSend.valid) {
      this.isFormSendLoading = true;

      const account = this.appServ.getCurrAccount();

      const seed: BIP32Interface = this.appServ.currSeed;
      const childSeed = seed.derivePath(account.path);
      const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(
        childSeed.privateKey
      );

      // const publicKey = this.appServ.currPublicKey;
      const address = this.appServ.currAddress;

      // if using balance validation
      let balance = await this.accServ.getAccountBalance().then((data: any) => {
        return data.balance;
      });

      if (/*balance / 1e8 > */ this.amountForm.value + this.feeForm.value) {
        let dataForm = {
          recipient: this.recipientForm.value,
          amount: this.amountForm.value * 1e8,
          fee: this.feeForm.value * 1e8,
          from: address,
          senderPublicKey: publicKey,
          timestamp: Math.trunc(Date.now() / 1000),
        };

        // template bytes
        let txBytes = transactionByte;
        // set signature bytes to 0
        txBytes.fill(0, 123, 187);

        txBytes.set(dataForm.senderPublicKey, 11);
        txBytes.set(addressToPublicKey(dataForm.recipient), 43);
        txBytes.set(bigintToByteArray(BigInt(dataForm.amount)), 75);
        txBytes.set(bigintToByteArray(BigInt(dataForm.fee)), 83);
        let timestampsView = new DataView(
          txBytes.buffer,
          txBytes.byteOffset,
          txBytes.byteLength
        );
        timestampsView.setUint32(3, dataForm.timestamp, true);

        let signature = nacl.sign.detached(txBytes, secretKey);
        console.log('txSignature:', signature);

        // set signature to bytes
        txBytes.set(signature, 123);
        console.log('signedTxBytes:', txBytes);

        Swal.fire({
          title: `Are you sure want to send money?`,
          showCancelButton: true,
          showLoaderOnConfirm: true,
          preConfirm: () => {
            return this.transactionServ
              .postTransaction(txBytes)
              .then((res: any) => {
                console.log('__result', res);
                if (res.isvalid) Swal.fire('Money sent');
                else Swal.fire({ html: res.message, type: 'error' });
                return true;
              })
              .catch(err => {
                console.log(err);
                Swal.fire({ html: err.error.error, type: 'error' });
                return true;
              });
          },
        }).then(() => (this.isFormSendLoading = false));
      } else {
        Swal.fire({ html: 'Balance is not enough', type: 'error' });
        this.isFormSendLoading = false;
      }
    }
  }
}
