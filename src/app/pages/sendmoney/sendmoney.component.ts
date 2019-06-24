import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { TransactionService } from "../../services/transaction.service";
import { AppService } from "../../app.service";
import { AccountService } from "../../services/account.service";
import {
  bigintToByteArray,
  BigInt,
  addressToPublicKey
} from "../../../helpers/converters";
import {
  GetPublicKeyFromSeed,
  GetKeyPairFromSeed,
  GetAddressFromPublicKey
} from "../../../helpers/utils";
import { transactionByte } from "../../../helpers/transactionByteTemplate";
import { ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-sendmoney",
  templateUrl: "./sendmoney.component.html",
  styleUrls: ["./sendmoney.component.css"]
})
export class SendmoneyComponent implements OnInit {
  formSend: FormGroup;
  recipientForm = new FormControl("", Validators.required);
  amountForm = new FormControl("", Validators.required);
  feeForm = new FormControl("", Validators.required);
  isFormSendLoading = false;

  constructor(
    private transactionServ: TransactionService,
    private appServ: AppService,
    private accServ: AccountService
  ) {
    this.formSend = new FormGroup({
      recipient: this.recipientForm,
      amount: this.amountForm,
      fee: this.feeForm
    });
  }

  ngOnInit() {}

  async onSendMoney() {
    if (this.formSend.valid) {
      this.isFormSendLoading = true;

      const seed = this.appServ.currSeed;
      const pairKey = GetKeyPairFromSeed(seed);
      const pubKey = GetPublicKeyFromSeed(seed);
      const address = GetAddressFromPublicKey(pubKey);

      // let balance = await this.accServ.getAccountBalance().then((data: any) => {
      //   return data.balance
      // });
      let balance = 100 * 1e8;

      if (balance / 1e8 > this.amountForm.value + this.feeForm.value) {
        // for testing uncomment comment
        let dataForm = {
          recipient: this.recipientForm.value,
          amount: this.amountForm.value * 1e8,
          fee: this.feeForm.value * 1e8,
          from: address,
          senderPublicKey: pubKey,
          timestamp: Math.trunc(Date.now() / 1000)
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

        // console.log("unsignedTxBytes:", byteArrayToHex(txBytes))
        let signature = this.accServ.GetSignature(pairKey, txBytes);
        // console.log("txSignature:", this.signature.toHex().toLowerCase())

        // set signature to bytes
        txBytes.set(signature.toBytes(), 123);
        // console.log("signedTxBytes:", byteArrayToHex(txBytes))
        Swal.fire({
          title: `Are you sure want to send money?`,
          showCancelButton: true,
          showLoaderOnConfirm: true,
          preConfirm: () => {
            return this.transactionServ
              .postTransaction(txBytes)
              .then((res: any) => {
                console.log("__result", res);
                if (res.isvalid) Swal.fire("Money sent");
                else Swal.fire({ html: res.message, type: "error" });
                return false;
              })
              .catch(err => {
                console.log(err);
                Swal.fire({ html: err.error.error, type: "error" });
                return false;
              });
          }
        }).then(() => (this.isFormSendLoading = false));
      } else {
        Swal.fire({ html: "Balance is not enough", type: "error" });
        this.isFormSendLoading = false;
      }
    }
  }
}
