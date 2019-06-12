import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import Swal from "sweetalert2";

import { AccountService } from "../../services/account.service";
import { AppService } from "../../app.service";

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

  pubKey: string;

  constructor(
    private accountServ: AccountService,
    private appServ: AppService
  ) {
    this.formSend = new FormGroup({
      recipient: this.recipientForm,
      amount: this.amountForm,
      fee: this.feeForm,
      passphrase: this.passPhraseForm
    });

    this.pubKey = appServ.getAddress()
  }

  ngOnInit() {}

  onSendMoney() {
    if (this.formSend.valid) {
      let data = {
        ...this.formSend.value,
        from: this.pubKey,
        senderPublicKey: "Send Pub Key",
        signatureHash: "Sig Hash"
      };
      console.log(data);
      
      Swal.fire({
        title: `Are you sure want to send money?`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.accountServ
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
