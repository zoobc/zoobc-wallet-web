import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { ContactService } from 'src/app/services/contact.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import zoobc, { SendMoneyInterface } from 'zoobc-sdk';
import { truncate } from 'src/helpers/utils';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-confirm-send',
  templateUrl: './confirm-send.component.html',
  styleUrls: ['./confirm-send.component.scss'],
})
export class ConfirmSendComponent implements OnInit {
  isLoading: boolean;
  contacts: import('e:/Workstation/Blockchain/zoobc/zoobc-wallet-web/src/app/services/contact.service').Contact[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private contactServ: ContactService,
    private translate: TranslateService,
    private router: Router,
    private authServ: AuthService
  ) {}
  account: any;
  form: any;
  customFee: boolean;
  kindFee: string;
  advancedMenu: boolean = false;
  currencyRateName: string;
  ngOnInit() {
    this.account = this.data.account;
    this.form = this.data.form;
    this.customFee = this.data.customFee;
    this.kindFee = this.data.kindFee;
    this.advancedMenu = this.data.advancedMenu;
    this.currencyRateName = this.data.currencyName;
  }

  onOpenPinDialog() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
    });

    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        this.onSendMoney();
      }
    });
  }

  async onSendMoney() {
    if (this.data.isValid) {
      this.isLoading = true;

      let data: SendMoneyInterface = {
        sender: this.account.address,
        recipient: this.form.recipient,
        fee: this.form.fee,
        amount: this.form.amount,
        approverAddress: this.form.addressApprover,
        commission: this.form.approverCommission,
        timeout: this.form.timeout,
        instruction: this.form.instruction,
      };
      // const txBytes = sendMoneyBuilder(data, this.keyringServ);
      const childSeed = this.authServ.seed;

      zoobc.Transactions.sendMoney(data, childSeed).then(
        async (res: any) => {
          this.isLoading = false;
          let message: string;
          await this.translate
            .get('Your Transaction is processing')
            .toPromise()
            .then(res => (message = res));
          let subMessage: string;
          await this.translate
            .get('You send coins to', {
              amount: data.amount,
              currencyValue: truncate(this.form.amountCurrency, 2),
              currencyName: this.currencyRateName,
              recipient: data.recipient,
            })
            .toPromise()
            .then(res => (subMessage = res));

          Swal.fire(message, subMessage, 'success');

          // save address
          if (this.data.saveAddress) {
            const newContact = {
              alias: this.data.alias,
              address: this.form.recipient,
            };
            this.contacts = this.contactServ.add(newContact);
          }
          this.closeDialog();
          this.router.navigateByUrl('/dashboard');
        },
        async err => {
          this.isLoading = false;
          console.log(err);

          let message: string;
          await this.translate
            .get('An error occurred while processing your request')
            .toPromise()
            .then(res => (message = res));
          Swal.fire('Opps...', message, 'error');
        }
      );
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
