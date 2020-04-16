import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContactService, Contact } from 'src/app/services/contact.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from 'src/environments/environment';
import { truncate, calcMinFee } from 'src/helpers/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import zoobc from 'zoobc-sdk';
import { SendMoneyInterface } from 'zoobc-sdk/types/helper/transaction-builder/send-money';

@Component({
  selector: 'app-sendmoney',
  templateUrl: './sendmoney.component.html',
  styleUrls: ['./sendmoney.component.scss'],
})
export class SendmoneyComponent implements OnInit {
  subscription: Subscription = new Subscription();

  contacts: Contact[];
  contact: Contact;
  filteredContacts: Observable<Contact[]>;

  @ViewChild('popupDetailSendMoney') popupDetailSendMoney: TemplateRef<any>;

  currencyRate: Currency;

  feeSlow = environment.fee;
  feeMedium = this.feeSlow * 5;
  feeFast = this.feeMedium * 5;
  activeButton: number = 2;
  kindFee: string;

  formSend: FormGroup;

  recipientForm = new FormControl('', Validators.required);
  amountForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  amountCurrencyForm = new FormControl('', Validators.required);
  feeForm = new FormControl(this.feeMedium, [Validators.required, Validators.min(this.feeSlow)]);
  feeFormCurr = new FormControl('', Validators.required);
  aliasField = new FormControl('', Validators.required);
  addressApproverField = new FormControl('', Validators.required);
  approverCommissionField = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  approverCommissionCurrField = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  instructionField = new FormControl('', Validators.required);
  timeoutField = new FormControl('', [Validators.required, Validators.min(1)]);
  typeCoinField = new FormControl('ZBC');
  typeCommissionField = new FormControl('ZBC');

  sendMoneyRefDialog: MatDialogRef<any>;

  isLoading = false;
  isError = false;

  account: SavedAccount;
  accounts: SavedAccount[];

  typeFee = 'ZBC';

  saveAddress: boolean = false;
  showSaveAddressBtn: boolean = true;
  customFee: boolean = false;
  advancedMenu: boolean = false;

  blockHeight: number;

  constructor(
    private authServ: AuthService,
    private currencyServ: CurrencyRateService,
    private contactServ: ContactService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.formSend = new FormGroup({
      recipient: this.recipientForm,
      amount: this.amountForm,
      amountCurrency: this.amountCurrencyForm,
      typeCoin: this.typeCoinField,
      alias: this.aliasField,
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      addressApprover: this.addressApproverField,
      approverCommission: this.approverCommissionField,
      approverCommissionCurr: this.approverCommissionCurrField,
      typeCommission: this.typeCommissionField,
      instruction: this.instructionField,
      timeout: this.timeoutField,
    });
    // disable alias field (saveAddress = false)
    this.aliasField.disable();
    // disable some field where (advancedMenu = false)
    this.disableFieldAdvancedMenu();

    const amount = this.activeRoute.snapshot.params['amount'];
    const recipient = this.activeRoute.snapshot.params['recipient'];
    this.amountForm.patchValue(amount);
    this.recipientForm.patchValue(recipient);
  }

  ngOnInit() {
    this.contacts = this.contactServ.getList() || [];

    // set filtered contacts function
    this.filteredContacts = this.recipientForm.valueChanges.pipe(
      startWith(''),
      map(value => this.filterContacts(value))
    );

    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      // set default fee to medium
      this.onChangeFeeField();
      // convert fee to current currency
      this.onFeeChoose(2);

      const minCurrency = truncate(this.feeSlow * rate.value, 8);

      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
      this.amountCurrencyForm.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);

    this.account = this.authServ.getCurrAccount();
    this.getAccounts();

    this.getBlockHeight();

    // this.watchEscrowField();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAccounts() {
    this.accounts = this.authServ.getAllAccount();
    this.accounts.forEach(account => {
      const contact: Contact = {
        address: account.address,
        alias: account.name,
      };
      this.contacts.push(contact);
    });
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
  }

  onChangeFeeField() {
    const fee = truncate(this.feeForm.value, 8);
    const feeCurrency = fee * this.currencyRate.value;
    this.feeFormCurr.patchValue(feeCurrency);
  }

  onChangeFeeCurrencyField() {
    const fee = this.feeFormCurr.value / this.currencyRate.value;
    const feeTrunc = truncate(fee, 8);
    this.feeForm.patchValue(feeTrunc);
  }

  filterContacts(value: string): Contact[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.contacts.filter((contact: Contact) => contact.alias.toLowerCase().includes(filterValue));
    } else if (value == '') return this.contacts;
  }

  isAddressInContacts() {
    const isAddressInContacts = this.contacts.some(c => {
      if (c.address == this.recipientForm.value) {
        this.contact = c;
        return true;
      } else return false;
    });

    if (isAddressInContacts) {
      this.aliasField.disable();
      this.saveAddress = false;
      this.showSaveAddressBtn = false;
    } else {
      this.showSaveAddressBtn = true;
    }
  }

  toggleSaveAddress() {
    if (this.saveAddress) {
      this.aliasField.disable();
      this.saveAddress = false;
    } else {
      this.aliasField.enable();
      this.saveAddress = true;
    }
  }

  toggleCustomFee() {
    this.customFee = !this.customFee;
    if (!this.customFee) this.onFeeChoose(this.activeButton);
  }

  toggleAdvancedMenu() {
    this.advancedMenu = !this.advancedMenu;
    this.enableFieldAdvancedMenu();
    if (!this.advancedMenu) this.disableFieldAdvancedMenu();
  }

  async onOpenDialogDetailSendMoney() {
    this.getMinimumFee();
    const total = this.amountForm.value + this.feeForm.value;
    if (this.account.balance / 1e8 >= total) {
      this.sendMoneyRefDialog = this.dialog.open(this.popupDetailSendMoney, {
        width: '500px',
        data: this.formSend.value,
      });
    } else {
      let message: string;
      await this.translate
        .get('Your balances are not enough for this transaction')
        .toPromise()
        .then(res => (message = res));
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  onOpenPinDialog() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
    });

    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        this.sendMoneyRefDialog.close();
        this.onSendMoney();
      }
    });
  }

  onFeeChoose(value) {
    let fee: number = 0;
    if (value === 1) {
      fee = this.feeSlow;
      this.kindFee = 'Slow';
    } else if (value === 2) {
      fee = this.feeMedium;
      this.kindFee = 'Average';
    } else {
      fee = this.feeFast;
      this.kindFee = 'Fast';
    }

    const feeCurrency = fee * this.currencyRate.value;
    this.formSend.patchValue({
      fee: fee,
      feeCurr: feeCurrency,
    });
    this.activeButton = value;
  }

  closeDialog() {
    this.sendMoneyRefDialog.close();
  }

  disableFieldAdvancedMenu() {
    this.addressApproverField.disable();
    this.approverCommissionField.disable();
    this.approverCommissionCurrField.disable();
    this.instructionField.disable();
    this.timeoutField.disable();
  }

  enableFieldAdvancedMenu() {
    this.addressApproverField.enable();
    this.approverCommissionField.enable();
    this.instructionField.enable();
    this.timeoutField.enable();
    this.approverCommissionCurrField.enable();
  }

  async onSendMoney() {
    if (this.formSend.valid) {
      this.isLoading = true;

      let data: SendMoneyInterface = {
        sender: this.account.address,
        recipient: this.recipientForm.value,
        fee: this.feeForm.value,
        amount: this.amountForm.value,
        approverAddress: this.addressApproverField.value,
        commission: this.approverCommissionField.value,
        timeout: this.timeoutField.value,
        instruction: this.instructionField.value,
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
              currencyValue: truncate(this.amountCurrencyForm.value, 2),
              currencyName: this.currencyRate.name,
              recipient: data.recipient,
            })
            .toPromise()
            .then(res => (subMessage = res));

          Swal.fire(message, subMessage, 'success');

          // save address
          if (this.saveAddress) {
            const newContact = {
              alias: this.aliasField.value,
              address: this.recipientForm.value,
            };
            this.contacts = this.contactServ.add(newContact);
          }

          this.sendMoneyRefDialog.close();
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

  getBlockHeight() {
    zoobc.Host.getBlock()
      .then(res => {
        this.blockHeight = res.chainstatusesList[1].height;
      })
      .catch(err => {
        console.log(err);
      });
  }

  async getMinimumFee() {
    let data: SendMoneyInterface = {
      sender: this.account.address,
      recipient: this.recipientForm.value,
      fee: this.feeForm.value,
      amount: this.amountForm.value,
      approverAddress: this.addressApproverField.value,
      commission: this.approverCommissionField.value,
      timeout: this.timeoutField.value,
      instruction: this.instructionField.value,
    };

    const fee: number = calcMinFee(data);
    this.feeSlow = fee;
    this.feeMedium = this.feeSlow * 5;
    this.feeFast = this.feeMedium * 5;

    this.feeForm.setValidators([Validators.required, Validators.min(fee)]);

    const feeCurrency = truncate(fee * this.currencyRate.value, 8);
    this.feeFormCurr.setValidators([Validators.required, Validators.min(feeCurrency)]);
    this.amountCurrencyForm.setValidators([Validators.required, Validators.min(feeCurrency)]);

    if (this.customFee == false) {
      let value: number = 0;
      switch (this.kindFee) {
        case 'Slow':
          value = this.feeSlow;
          break;
        case 'Fast':
          value = this.feeFast;
          break;
        default:
          value = this.feeMedium;
      }
      this.feeForm.patchValue(value);
    }
  }

  onChangeTimeOut() {
    this.getMinimumFee();
  }
}
