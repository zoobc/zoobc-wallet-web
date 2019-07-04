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
import { KeyringService } from 'src/app/services/keyring.service';

const coin = 'ZBC';

@Component({
  selector: 'app-sendmoney',
  templateUrl: './sendmoney.component.html',
  styleUrls: ['./sendmoney.component.css'],
})
export class SendmoneyComponent implements OnInit {
  contact;
  keyword = 'alias';
  formSend: FormGroup;
  recipientForm = new FormControl('', Validators.required);
  amountForm = new FormControl('', Validators.required);
  feeForm = new FormControl('', Validators.required);
  isFormSendLoading = false;

  constructor(
    private transactionServ: TransactionService,
    private appServ: AppService,
    private accServ: AccountService,
    private keyringServ: KeyringService
  ) {
    this.formSend = new FormGroup({
      recipient: this.recipientForm,
      amount: this.amountForm,
      fee: this.feeForm,
    });
  }

  ngOnInit() {
    this.contact = this.appServ.getContactList();
  }

  selectEvent(item) {
    // do something with selected item
  }

  onChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something
  }

  async onSendMoney() {
    if (this.formSend.valid) {
      this.isFormSendLoading = true;

      const account = this.accServ.getCurrAccount();

      const seed = Buffer.from(this.accServ.currSeed, 'hex');
      // this.keyringServ.calcBip32RootKeyFromSeed(coin, seed);
      // const childSeed = seed.derivePath(account.path);
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(coin, 0);
      // const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(
      //   childSeed.privateKey
      // );

      // const publicKey = this.appServ.currPublicKey;
      const address = this.accServ.currAddress;

      // if using balance validation
      let balance = await this.accServ.getAccountBalance().then((data: any) => {
        return data.balance;
      });

      if (/*balance / 1e8 > */ this.amountForm.value + this.feeForm.value) {
        let dataForm = {
          recipient: this.recipientForm.value.address,
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

        // let signature = nacl.sign.detached(txBytes, secretKey);
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
