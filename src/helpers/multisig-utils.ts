import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import {
  sendMoneyBuilder,
  SendMoneyInterface,
  updateNodeBuilder,
  UpdateNodeInterface,
  ZBCAddressToBytes,
  TransactionType,
} from 'zoobc-sdk';

// general
export const senderForm = new FormControl('', Validators.required);
export const feeForm = new FormControl(environment.fee, [
  Validators.required,
  Validators.min(environment.fee),
]);
export const feeFormCurr = new FormControl('', Validators.required);
export const typeCoinField = new FormControl('ZBC');
export const typeFeeField = new FormControl('ZBC');

// send money
export const recipientForm = new FormControl('', Validators.required);
export const amountForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
export const amountCurrencyForm = new FormControl('', Validators.required);

// update node
export const ipAddressForm = new FormControl('', [
  Validators.required,
  Validators.pattern('^https?://+[\\w.-]+:\\d+$'),
]);
export const lockedAmountForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
export const nodePublicKeyForm = new FormControl('', Validators.required);

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
};

export const updateNodeForm = {
  accountAddress: 'accountAddress',
  ipAddress: 'nodeAddress',
  lockedAmount: 'funds',
  fee: 'fee',
  feeCurr: 'feeCurr',
  typeFee: 'typeFee',
  nodePublicKey: 'nodePublicKey',
};

export function createInnerTxForm(txType: number) {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return new FormGroup({
        sender: senderForm,
        recipient: recipientForm,
        amount: amountForm,
        amountCurrency: amountCurrencyForm,
        fee: feeForm,
        feeCurr: feeFormCurr,
        typeCoin: typeCoinField,
        typeFee: typeFeeField,
      });
    case TransactionType.UPDATENODEREGISTRATIONTRANSACTION:
      return new FormGroup({
        sender: senderForm,
        fee: feeForm,
        feeCurr: feeFormCurr,
        typeCoin: typeCoinField,
        typeFee: typeFeeField,

        nodeAddress: ipAddressForm,
        funds: lockedAmountForm,
        nodePublicKey: nodePublicKeyForm,
      });
  }
}

export function createTxBytes(form: any, txType: number): Buffer {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return createSendMoney(form);
    case TransactionType.UPDATENODEREGISTRATIONTRANSACTION:
      return createUpdateNode(form);
  }
}

export function getFieldList(txType: number): Object {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return sendMoneyForm;
    case TransactionType.UPDATENODEREGISTRATIONTRANSACTION:
      return updateNodeForm;
  }
}

export function getTxType(type: number) {
  switch (type) {
    case TransactionType.SENDMONEYTRANSACTION:
      return 'send money';
    case TransactionType.UPDATENODEREGISTRATIONTRANSACTION:
      return 'update node';
  }
}

function createSendMoney(form: any) {
  const { sender, fee, amount, recipient } = form;
  const data: SendMoneyInterface = { sender, fee, amount, recipient };
  return sendMoneyBuilder(data);
}

function createUpdateNode(form: any) {
  const { sender, fee, nodePublicKey, nodeAddress, funds } = form;
  const data: UpdateNodeInterface = {
    accountAddress: sender,
    fee,
    nodePublicKey: ZBCAddressToBytes(nodePublicKey),
    nodeAddress,
    funds,
  };
  return updateNodeBuilder(data, Buffer.from([0, 0, 0, 0]));
}
