import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { TransactionService } from "../../services/transaction.service";
import { AppService } from "../../app.service";
import { AccountService } from "../../services/account.service";
import * as sha256 from "sha256";
import {
  hexToByteArray,
  byteArrayToHex,
  publicKeyToAddress,
  bigintToByteArray,
  BigInt,
  addressToPublicKey,
} from "../../../helpers/converters";
// import * as BN from 'bn.js'

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
  passPhraseForm = new FormControl("", Validators.required);

  address: string;
  pairKey: any;
  pubKey: any;
  passphrase: any;
  signature: any;

  constructor(
    private transactionServ: TransactionService,
    private appServ: AppService,
    private accServ: AccountService
  ) {
    this.formSend = new FormGroup({
      recipient: this.recipientForm,
      amount: this.amountForm,
      fee: this.feeForm,
      passphrase: this.passPhraseForm
    });
  }

  ngOnInit() {}

  onSendMoney() {
    // if (this.formSend.valid) {

      this.passphrase = this.formSend.value.passphrase
      const seed = this.accServ.GetSeedFromPhrase(this.passphrase)

      this.pairKey = this.accServ.GetKeyPairFromSeed(seed)
      // console.log("pair",this.pairKey)
      this.pubKey = this.accServ.GetPublicKeyFromSeed(seed)
      console.log("pubkey",this.pubKey)
      this.address = this.accServ.GetAddressFromPublicKey(this.pubKey)
      // console.log("address",this.address)

      if (this.address == this.appServ.getAddress()) {
        // for testing uncomment comment
        let dataForm = {
          recipient: this.recipientForm.value,
          amount: this.amountForm.value * 1e8,
          fee: this.feeForm.value * 1e8,
        }

        let data = {
          ... dataForm,
          from: this.address,
          senderPublicKey: this.pubKey,
          timestamp : Math.trunc(Date.now()/1000)
        };
        // console.log("oi",data)

        // template bytes
        let txBytes = new Uint8Array([0,1,1,225,217,1,0,60,0,0,0,157,100,181,77,94,255,208,17,9,95,54,97,111,213,162,252,31,195,106,89,187,189,33,99,54,62,15,98,177,235,172,238,53,228,6,41,106,120,241,180,5,188,0,192,177,125,33,241,252,223,225,24,29,133,124,214,172,146,164,162,67,23,204,224,213,78,0,0,0,0,0,0,191,47,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,235,91,34,231,240,116,163,104,100,178,95,155,232,156,43,34,172,200,50,190,109,240,242,239,33,48,247,117,86,37,254,132,240,165,184,252,137,55,84,181,70,89,141,106,213,21,150,205,214,168,54,160,10,180,105,161,74,135,17,235,210,42,102,1])
        // set signature bytes to 0
        txBytes.fill(0, 123, 187)

        txBytes.set(data.senderPublicKey, 11)
        txBytes.set(addressToPublicKey(data.recipient), 43)
        txBytes.set(bigintToByteArray(BigInt(data.amount)), 75)
        txBytes.set(bigintToByteArray(BigInt(data.fee)), 83)
        let timestampsView = new DataView(txBytes.buffer, txBytes.byteOffset, txBytes.byteLength)
        timestampsView.setUint32(3, data.timestamp, true)

        // console.log("unsignedTxBytes:", byteArrayToHex(txBytes))
        this.signature = this.accServ.GetSignature(this.pairKey, txBytes)
        // console.log("txSignature:", this.signature.toHex().toLowerCase())

        // set signature to bytes
        txBytes.set(this.signature.toBytes(), 123)
        // console.log("signedTxBytes:", byteArrayToHex(txBytes))

        Swal.fire({
          title: `Are you sure want to send money?`,
          showCancelButton: true,
          showLoaderOnConfirm: true,
          preConfirm: () => {
            return this.transactionServ
              .postTransaction(txBytes)
              .then((res: any) => {
                console.log("__result", res)
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
        });
      } else {
        Swal.fire({ html: "Passphrase is invalid", type: "error" });
      }
    }
  // }
}
