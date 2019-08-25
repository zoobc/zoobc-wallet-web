import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import {
  bigintToByteArray,
  BigInt,
  addressToPublicKey,
  fromBase64Url,
  readInt64,
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
import { PostTransactionResponse } from 'src/app/grpc/model/transaction_pb';
import { BytesMaker } from 'src/helpers/BytesMaker';

const coin = 'ZBC';

@Component({
  selector: 'app-sendmoney',
  templateUrl: './sendmoney.component.html',
  styleUrls: ['./sendmoney.component.scss'],
})
export class SendmoneyComponent implements OnInit {
  contacts: Contact[];
  filteredContacts: Observable<Contact[]>;

  @ViewChild('popupDetailSendMoney') popupDetailSendMoney: TemplateRef<any>;
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

  bytes = new Uint8Array(193);

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

    this.contacts = this.contactServ.getContactList() || [];
    // set filtered contacts function
    this.filteredContacts = this.recipientForm.valueChanges.pipe(
      startWith(''),
      map(value => this.filterContacts(value))
    );
    this.currencyServ.currencyRate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });

    let bytes = new BytesMaker(10);
    bytes.write4bytes(3);
    console.log(bytes);
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

      const sender = Buffer.from(this.authServ.currAddress, 'utf-8');
      const recepient = Buffer.from(this.recipientForm.value, 'utf-8');
      const fee = this.amountForm.value;
      const timestamp = Math.trunc(Date.now());

      let bytes = new Buffer(129);
      // transaction type
      bytes.writeInt32LE(1, 0);
      // version
      bytes.writeInt8(1, 4);
      // timestamp
      bytes.set(bigintToByteArray(BigInt(timestamp)), 5);
      // sender address length
      bytes.writeInt32LE(44, 13);
      // sender address
      bytes.set(sender, 17);
      // recepient address length
      bytes.writeInt32LE(44, 61);
      // recepient address
      bytes.set(recepient, 65);
      // tx fee
      bytes.set(bigintToByteArray(BigInt(fee)), 109);
      // tx body length
      bytes.writeInt32LE(8, 117);
      // tx body
      bytes.set(bigintToByteArray(BigInt(1)), 121);

      let bytesWithSign = new Buffer(193);
      bytesWithSign.set(bytes, 0);

      let signature = childSeed.sign(bytes);
      bytesWithSign.set(signature, 129);

      // this.transactionServ.postTransaction(txBytes).then((res: any) => {
      //   this.isFormSendLoading = true;
      //   if (res.isvalid)
      Swal.fire(
        '<b>Your transaction is on the way !</b>',
        'You send <b>' +
          (this.amountForm.value + this.feeForm.value) +
          '</b> coins (' +
          (this.amountForm.value + this.feeForm.value) *
            this.currencyRate.value +
          ' ' +
          this.currencyRate.name +
          ') ' +
          'to this <b>' +
          this.recipientForm.value +
          '</b> address',
        'success'
      );
      this.isFormSendLoading = false;
      this.formSend.reset();
      Object.keys(this.formSend.controls).forEach(key => {
        this.formSend.controls[key].setErrors(null);
      });
      this.closeDialog();
    }
  }
}
