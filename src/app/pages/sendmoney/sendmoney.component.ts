import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import {
  bigintToByteArray,
  BigInt,
  addressToPublicKey,
} from '../../../helpers/converters';
import { transactionByte } from '../../../helpers/transactionByteTemplate';
import { KeyringService } from 'src/app/services/keyring.service';
import { ContactService, Contact } from 'src/app/services/contact.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  CurrencyRateService,
  Currency,
} from 'src/app/services/currency-rate.service';
import { MatDialog } from '@angular/material';

const coin = 'ZBC';

export interface SendMoney {
  type: string;
  detail: string;
}

@Component({
  selector: 'app-sendmoney',
  templateUrl: './sendmoney.component.html',
  styleUrls: ['./sendmoney.component.scss'],
})
export class SendmoneyComponent implements OnInit {
  displayedColumns: string[] = ['type', 'detail'];
  contacts: Contact[];
  filteredContacts: Observable<Contact[]>;

  @ViewChild('popupDetailSendMoney') popupDetailSendMoney: TemplateRef<any>;
  @ViewChild('popupSendMoneySuccess') popupSendMoneySuccess: TemplateRef<any>;
  currencyRate: Currency = {
    name: '',
    value: 0,
  };
  keyword = 'alias';
  formSend: FormGroup;
  recipientForm = new FormControl('', Validators.required);
  amountForm = new FormControl('', Validators.required);
  feeForm = new FormControl('0', Validators.required);
  isFormSendLoading = false;
  address = this.authServ.currAddress;

  account: SavedAccount;

  constructor(
    private activRoute: ActivatedRoute,
    private transactionServ: TransactionService,
    private accServ: AccountService,
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private currencyServ: CurrencyRateService,
    private contactServ: ContactService,
    private translate: TranslateService,
    public dialog: MatDialog
  ) {
    this.formSend = new FormGroup({
      recipient: this.recipientForm,
      amount: this.amountForm,
      fee: this.feeForm,
    });

    this.account = authServ.getCurrAccount();
  }

  ngOnInit() {
    this.formSend.patchValue({
      recipient: this.activRoute.snapshot.params['recipient'] || '',
      amount: this.activRoute.snapshot.params['amount'] || '',
    });

    this.contacts = this.contactServ.getContactList();
    // set filtered contacts function
    this.filteredContacts = this.recipientForm.valueChanges.pipe(
      startWith(''),
      map(value => this.filterContacts(value))
    );
    this.currencyServ.currencyRate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      console.log(this.currencyRate.value);
    });
  }

  filterContacts(value: string) {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.contacts.filter((contact: Contact) =>
        contact.alias.toLowerCase().includes(filterValue)
      );
    }
  }

  onOpenDialogDetailSendMoney() {
    this.dialog.open(this.popupDetailSendMoney, {
      width: '600px',
      data: this.formSend.value,
    });
    console.log(this.formSend.value);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  async onSendMoney() {
    if (this.formSend.valid) {
      this.isFormSendLoading = false;

      const account = this.account;
      const seed = Buffer.from(this.authServ.currSeed, 'hex');

      this.keyringServ.calcBip32RootKeyFromSeed(coin, seed);
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(
        coin,
        account.path
      );
      const address = this.authServ.currAddress;

      // if using balance validation
      // let balance = await this.accServ.getAccountBalance().then((data: any) => {
      //   this.isFormSendLoading = false;
      //   return data.balance;
      // });

      if (/*balance / 1e8 > */ this.amountForm.value + this.feeForm.value) {
        // const recepients =
        //   typeof this.recipientForm.value === 'object' ?  this.recipientForm.value.address : this.recipientForm.value;
        let dataForm = {
          recipient: this.recipientForm.value,
          amount: this.amountForm.value * 1e8,
          fee: this.feeForm.value * 1e8,
          from: address,
          senderPublicKey: childSeed.publicKey,
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

        let signature = childSeed.sign(txBytes);
        console.log('txSignature:', signature);
        const rateFixed = this.currencyRate.value.toFixed(2);

        // set signature to bytes
        txBytes.set(signature, 123);
        console.log('signedTxBytes:', txBytes);
        // this.transactionServ.postTransaction(txBytes).then((res: any) => {
        //   this.isFormSendLoading = true;
        //   if (res.isvalid)
        Swal.fire(
          '<b>Your transaction is on the way !</b>',
          'You send <b>' +
            (this.amountForm.value + this.feeForm.value) +
            '</b> coins (' +
            (this.amountForm.value + this.feeForm.value) *
              parseFloat(rateFixed) +
            ' ' +
            this.currencyRate.name +
            ') ' +
            'to this <b>' +
            this.recipientForm.value +
            '</b> address',
            'success',
        );
        // else Swal.fire({ html: res.message, type: 'error' });
        this.isFormSendLoading = false;
        this.formSend.reset();
        Object.keys(this.formSend.controls).forEach(key => {
          this.formSend.controls[key].setErrors(null);
        });
        this.closeDialog();
        // });
      }
    }
  }
}
