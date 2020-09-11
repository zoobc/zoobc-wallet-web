import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContactService, Contact } from 'src/app/services/contact.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, SavedAccount } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from 'src/environments/environment';
import { calcMinFee, getTranslation } from 'src/helpers/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import zoobc, { PostTransactionResponses, HostInfoResponse } from 'zoobc-sdk';
import { SendMoneyInterface } from 'zoobc-sdk/types/helper/transaction-builder/send-money';
import { ConfirmSendComponent } from './confirm-send/confirm-send.component';

@Component({
  selector: 'app-sendmoney',
  templateUrl: './sendmoney.component.html',
  styleUrls: ['./sendmoney.component.scss'],
})
export class SendmoneyComponent implements OnInit {
  contacts: Contact[];
  contact: Contact;
  filteredContacts: Observable<Contact[]>;

  minFee = environment.fee;
  formSend: FormGroup;

  recipientForm = new FormControl('', Validators.required);
  amountForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  aliasField = new FormControl('', Validators.required);
  addressApproverField = new FormControl('', Validators.required);
  approverCommissionField = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  instructionField = new FormControl('', Validators.required);
  timeoutField = new FormControl('', [Validators.required, Validators.min(1), Validators.max(720)]);

  sendMoneyRefDialog: MatDialogRef<any>;

  isLoading = false;
  isError = false;

  account: SavedAccount;
  accounts: SavedAccount[];

  saveAddress: boolean = false;
  showSaveAddressBtn: boolean = true;
  advancedMenu: boolean = false;

  blockHeight: number;

  constructor(
    private authServ: AuthService,
    private contactServ: ContactService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.formSend = new FormGroup({
      recipient: this.recipientForm,
      amount: this.amountForm,
      alias: this.aliasField,
      fee: this.feeForm,
      addressApprover: this.addressApproverField,
      approverCommission: this.approverCommissionField,
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
    this.account = this.authServ.getCurrAccount();
    if (this.account.type == 'multisig') {
      let message = getTranslation('please use normal account to use this feature', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
      this.router.navigateByUrl('/dashboard');
    }
    this.contacts = this.contactServ.getList() || [];

    // set filtered contacts function
    this.filteredContacts = this.recipientForm.valueChanges.pipe(
      startWith(''),
      map(value => this.filterContacts(value))
    );

    this.getAccounts();
    this.getBlockHeight();
  }

  getAccounts() {
    this.accounts = this.authServ.getAllAccount();
    this.accounts.forEach(account => {
      const contact: Contact = {
        address: account.address,
        name: account.name,
      };
      this.contacts.push(contact);
    });
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
  }

  filterContacts(value: string): Contact[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.contacts.filter((contact: Contact) => contact.name.toLowerCase().includes(filterValue));
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

  toggleAdvancedMenu() {
    this.advancedMenu = !this.advancedMenu;
    this.enableFieldAdvancedMenu();
    if (!this.advancedMenu) this.disableFieldAdvancedMenu();
  }

  async onOpenDialogDetailSendMoney() {
    this.getMinimumFee();
    const total = this.amountForm.value + this.feeForm.value;
    const balance = this.account.balance / 1e8;
    if (balance >= total) {
      this.sendMoneyRefDialog = this.dialog.open(ConfirmSendComponent, {
        width: '500px',
        maxHeight: '90vh',
        data: {
          form: this.formSend.value,
          advancedMenu: this.advancedMenu,
          account: this.account,
          saveAddress: this.saveAddress,
          alias: this.aliasField.value,
        },
      });
      this.sendMoneyRefDialog.afterClosed().subscribe(onConfirm => {
        if (onConfirm) {
          this.onOpenPinDialog();
        }
      });
    } else {
      let message = getTranslation('your balances are not enough for this transaction', this.translate, {
        amount: balance - this.feeForm.value,
      });
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  onOpenPinDialog() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });

    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        this.onSendMoney();
      }
    });
  }

  disableFieldAdvancedMenu() {
    this.addressApproverField.disable();
    this.approverCommissionField.disable();
    this.instructionField.disable();
    this.timeoutField.disable();
  }

  enableFieldAdvancedMenu() {
    this.addressApproverField.enable();
    this.approverCommissionField.enable();
    this.instructionField.enable();
    this.timeoutField.enable();
  }

  onSendMoney() {
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
        async (res: PostTransactionResponses) => {
          this.isLoading = false;
          let message = getTranslation('your transaction is processing', this.translate);
          let subMessage = getTranslation('you send coins to', this.translate, {
            amount: data.amount,
            recipient: data.recipient,
          });
          Swal.fire(message, subMessage, 'success');

          // save address
          if (this.saveAddress) {
            const newContact: Contact = {
              name: this.aliasField.value,
              address: this.recipientForm.value,
            };
            this.contacts = this.contactServ.add(newContact);
          }
          this.router.navigateByUrl('/dashboard');
        },
        async err => {
          this.isLoading = false;
          console.log(err);

          let message = getTranslation('an error occurred while processing your request', this.translate);
          Swal.fire('Opps...', message, 'error');
        }
      );
    }
  }

  getBlockHeight() {
    zoobc.Host.getInfo()
      .then((res: HostInfoResponse) => {
        res.chainstatusesList.filter(chain => {
          if (chain.chaintype === 0) this.blockHeight = chain.height;
        });
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
    this.minFee = fee;

    this.feeForm.setValidators([Validators.required, Validators.min(fee)]);
    if (fee > this.feeForm.value) this.feeForm.patchValue(fee);
    this.feeForm.updateValueAndValidity();
    this.feeForm.markAsTouched();
  }

  onChangeTimeOut() {
    this.getMinimumFee();
  }
}
