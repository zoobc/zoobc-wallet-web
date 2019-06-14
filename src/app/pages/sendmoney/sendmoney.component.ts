import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { TransactionService } from '../../services/transaction.service';
import { AppService } from "../../app.service";
import { AccountService } from '../../services/account.service';
import * as sha256 from 'sha256';

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
    if (this.formSend.valid) {
      // for testing uncomment comment
      let datahash = sha256(this.formSend.valid)
      this.passphrase = this.formSend.value.passphrase
      console.log("pass",this.passphrase)

      // convert passphrase to array
      let arrayOfPasspharase = this.passphrase.split(' ')
      
      this.pairKey = this.accServ.GetKeyPairFromSeed(arrayOfPasspharase)
      console.log("pair",this.pairKey)
      this.address = this.accServ.GetAddressFromSeed(arrayOfPasspharase)
      console.log("address",this.address)
      this.pubKey = this.accServ.GetPublicKeyFromSeed(arrayOfPasspharase)
      console.log("pubkey",this.pubKey)
      this.signature = this.accServ.GetSignature(this.pairKey, datahash)
      console.log("signature",this.signature)
      let data = {
        ...this.formSend.value,
        from: this.address,
        senderPublicKey: this.pubKey,
        signatureHash: this.signature
      };
      console.log(data);

      Swal.fire({
        title: `Are you sure want to send money?`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.transactionServ
            .sendMoney(data)
            .then((res: any) => {
              Swal.fire("Money sent");
              return false;
            })
            .catch(res => {
              console.log(res);
              Swal.fire({ html: res.error.error, type: "error" });
              return false;
            });
        }
      });
    }
  }
}
