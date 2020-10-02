import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import {
  sendMoneyBuilder,
  SendMoneyInterface,
  TransactionType,
  SetupDatasetInterface,
  setupDatasetBuilder,
} from 'zoobc-sdk';

// ===================== FORM ==================== //
// general
export const senderForm = new FormControl('', Validators.required);
export const feeForm = new FormControl(environment.fee, [
  Validators.required,
  Validators.min(environment.fee),
]);
export const feeFormCurr = new FormControl('', Validators.required);
export const typeCoinField = new FormControl('ZBC');
export const typeFeeField = new FormControl('ZBC');

// escrow
export const addressApproverField = new FormControl('', Validators.required);
export const approverCommissionField = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
export const approverCommissionCurrField = new FormControl('', [
  Validators.required,
  Validators.min(1 / 1e8),
]);
export const instructionField = new FormControl('', Validators.required);
export const timeoutField = new FormControl('', [
  Validators.required,
  Validators.min(1),
  Validators.max(720),
]);
export const typeCommissionField = new FormControl('ZBC');

// send money
export const recipientForm = new FormControl('', Validators.required);
export const amountForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
export const amountCurrencyForm = new FormControl('', Validators.required);
export const aliasField = new FormControl('', Validators.required);

// setup dataset
export const propertyField = new FormControl('', [Validators.required]);
export const valueField = new FormControl('', [Validators.required]);

// ========================= END FORM ============================ //

// ========================== INPUT MAP ========================== //
export const escrowForm = {
  addressApprover: 'addressApprover',
  typeCommission: 'typeCommission',
  approverCommissionCurr: 'approverCommissionCurr',
  approverCommission: 'approverCommission',
  timeout: 'timeout',
  instruction: 'instruction',
};

export const sendMoneyForm = {
  sender: 'sender',
  recipient: 'recipient',
  alias: 'alias',
  typeCoin: 'typeCoin',
  amountCurrency: 'amountCurrency',
  amount: 'amount',
  typeFee: 'typeFee',
  feeCurrency: 'feeCurr',
  fee: 'fee',
  ...escrowForm,
};

export const setupDataSetForm = {
  sender: 'sender',
  property: 'property',
  value: 'value',
  recipientAddress: 'recipientAddress',
  fee: 'fee',
  feeCurr: 'feeCurr',
  typeFee: 'typeFee',
};
// =========================== END INPUT MAP ======================= //

export function createInnerTxForm(txType: number) {
  const escrowAddition = {
    addressApprover: addressApproverField,
    typeCommission: typeCommissionField,
    approverCommissionCurr: approverCommissionCurrField,
    approverCommission: approverCommissionField,
    timeout: timeoutField,
    instruction: instructionField,
  };
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return new FormGroup({
        sender: senderForm,
        recipient: recipientForm,
        amount: amountForm,
        amountCurrency: amountCurrencyForm,
        alias: aliasField,
        fee: feeForm,
        feeCurr: feeFormCurr,
        typeCoin: typeCoinField,
        typeFee: typeFeeField,
        ...escrowAddition,
      });

    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return new FormGroup({
        sender: senderForm,
        property: propertyField,
        value: valueField,
        recipientAddress: recipientForm,
        fee: feeForm,
        feeCurr: feeFormCurr,
        typeFee: typeFeeField,
      });
  }
}

export function createTxBytes(form: any, txType: number): Buffer {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return createSendMoney(form);
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return createSetupDataset(form);
  }
}

export function getFieldList(txType: number): Object {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return sendMoneyForm;
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return setupDataSetForm;
  }
}

export function getTxType(type: number) {
  switch (type) {
    case TransactionType.SENDMONEYTRANSACTION:
      return 'send money';
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return 'setup account dataset';
  }
}

function createSendMoney(form: any) {
  const { sender, fee, amount, recipient } = form;
  const data: SendMoneyInterface = { sender, fee, amount, recipient };
  return sendMoneyBuilder(data);
}

function createSetupDataset(form: any) {
  const { sender, fee, recipientAddress, property, value } = form;
  const data: SetupDatasetInterface = {
    property,
    value,
    setterAccountAddress: sender,
    recipientAccountAddress: recipientAddress,
    fee: fee,
  };
  return setupDatasetBuilder(data);
}
