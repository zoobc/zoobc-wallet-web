import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { GrpcapiService } from '../../services/grpcapi.service';
import { AppService } from "../../app.service";
import { AccountService } from '../../services/account.service';
import * as sha256 from 'sha256';
import { hexToByteArray, byteArrayToHex, publicKeyToAddress, bigintToByteArray, BigInt }  from '../../../helpers/converters'
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
    private grpcServ: GrpcapiService,
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
    // event.preventDefault()
    if (this.formSend.valid) {
      // for testing uncomment comment
      let dataForm = {
        recipient: this.recipientForm.value,
        amount: this.amountForm.value,
        fee: this.feeForm.value,
      }

      this.passphrase = this.formSend.value.passphrase
      // console.log("pass",this.passphrase)

      // split passphrase
      let splitPassphrase = this.passphrase.split(' ')
      
      this.pairKey = this.accServ.GetKeyPairFromSeed(splitPassphrase)
      // console.log("pair",this.pairKey)
      this.address = this.accServ.GetAddressFromSeed(splitPassphrase)
      // console.log("address",this.address)
      this.pubKey = this.accServ.GetPublicKeyFromSeed(splitPassphrase)
      console.log("pubkey",this.pubKey)
      let timestamps = Date.now()
      let data = {
        ... dataForm,
        from: this.address,
        senderPublicKey: this.pubKey,
        // signatureHash: this.signature,
        timestamp : timestamps
      };
      // console.log("oi",data)

      const txBytes = hexToByteArray("0100018407025d3c00000004264abef89b96225a837f9d6a2ccc09e8b1422e090c0fa3852bb139d99caec404264a2ef814619d4a2b1fa3b45f4aa09b248d53ef07d8e92237f3cc8eb30d6d809698000000000000e1f5050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004264a2ef814619d4a2b1fa3b45f4aa09b248d53ef07d8e92237f3cc8eb30d6d809698000000000000e1f50500000000")
      txBytes.set(data.senderPublicKey, 11)
      // txBytes.set(bigintToByteArray(BigInt(data.recipient)), 43)
      txBytes.set(bigintToByteArray(BigInt(data.amount)), 75)
      txBytes.set(bigintToByteArray(BigInt(data.fee)), 83)

      // const txView = new DataView(txBytes.buffer, txBytes.byteOffset, txBytes.byteLength)
      // console.log("__acc",new BN(10).toArrayLike(Uint8Array,"be",8))
      // txView.setBigUint64(83, new BN(data.fee))
      // txView.setBigUint64(75, new BN(data.amount))
      // txBytes.set(data.recipient,43) // uintarray pubkey
  
      console.log("unsignedTxBytes:", byteArrayToHex(txBytes))
      this.signature = this.accServ.GetSignature(this.pairKey, txBytes)
      console.log("txSignature:", this.signature.toHex().toLowerCase())

      txBytes.set(this.signature.toBytes(), 123)
      console.log("signedTxBytes:", byteArrayToHex(txBytes))

      Swal.fire({
        title: `Are you sure want to send money?`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.grpcServ
            .postTransaction(txBytes)
            .then((res: any) => {
              // console.log("__result", res)
              Swal.fire("Money sent");
              return false;
            })
            .catch(err => {
              console.log(err);
              Swal.fire({ html: err.error.error, type: "error" });
              return false;
            });
        }
      });
    }
  }
}
