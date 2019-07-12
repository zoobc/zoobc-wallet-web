import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { TransactionService } from '../../services/transaction.service';
import { AppService } from '../../app.service';
import { AccountService, SavedAccount } from '../../services/account.service';
import {
  bigintToByteArray,
  BigInt,
  addressToPublicKey,
} from '../../../helpers/converters';
import { transactionByte } from '../../../helpers/transactionByteTemplate';
import { KeyringService } from 'src/app/services/keyring.service';
import { ContactService } from 'src/app/services/contact.service';

const coin = 'ZBC';

@Component({
  selector: 'app-sendmoney',
  templateUrl: './sendmoney.component.html',
  styleUrls: ['./sendmoney.component.scss'],
})
export class SendmoneyComponent implements OnInit {
  contacts;
  keyword = 'alias';
  formSend: FormGroup;
  recipientForm = new FormControl('', Validators.required);
  amountForm = new FormControl('', Validators.required);
  feeForm = new FormControl('0', Validators.required);
  isFormSendLoading = false;

  account: SavedAccount;

  constructor(
    private transactionServ: TransactionService,
    private accServ: AccountService,
    private keyringServ: KeyringService,
    private contactServ: ContactService
  ) {
    this.formSend = new FormGroup({
      recipient: this.recipientForm,
      amount: this.amountForm,
      fee: this.feeForm,
    });

    this.account = accServ.getCurrAccount();
  }

  ngOnInit() {
    this.contacts = this.contactServ.getContactList();
  }

  async onSendMoney() {
    if (this.formSend.valid) {
      this.isFormSendLoading = false;

      const account = this.account;
      const seed = Buffer.from(this.accServ.currSeed, 'hex');

      this.keyringServ.calcBip32RootKeyFromSeed(coin, seed);
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(
        coin,
        account.path
      );
      const address = this.accServ.currAddress;

      // if using balance validation
      let balance = await this.accServ.getAccountBalance().then((data: any) => {
        this.isFormSendLoading = false;
        return data.balance;
      });

      if (/*balance / 1e8 > */ this.amountForm.value + this.feeForm.value) {
        let dataForm = {
          recipient: this.recipientForm.value,
          amount: this.amountForm.value * 1e8,
          fee: this.feeForm.value * 1e8,
          from: address,
          senderPublicKey: childSeed.publicKey,
          timestamp: Math.trunc(Date.now() / 1000),
        };
        console.log(dataForm);

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

        let signature = childSeed.sign(txBytes);
        console.log('txSignature:', signature);

        // set signature to bytes
        txBytes.set(signature, 123);
        console.log('signedTxBytes:', txBytes);

        Swal.fire({
          title: `Are you sure want to send money?`,
          showCancelButton: true,
          showLoaderOnConfirm: true,
          preConfirm: () => {
            this.isFormSendLoading = true;
            return this.transactionServ
              .postTransaction(txBytes)
              .then((res: any) => {
                if (res.isvalid) Swal.fire('Money sent');
                else Swal.fire({ html: res.message, type: 'error' });

                this.isFormSendLoading = false;

                this.formSend.reset();
                Object.keys(this.formSend.controls).forEach(key => {
                  this.formSend.controls[key].setErrors(null);
                });
                return false;
              })
              .catch(err => {
                console.log(err);
                Swal.fire({ html: err.error.error, type: 'error' });
                this.isFormSendLoading = false;
                return false;
              });
          },
        });
      } else {
        Swal.fire({ html: 'Balance is not enough', type: 'error' });
        this.isFormSendLoading = false;
      }
    }
  }
}
