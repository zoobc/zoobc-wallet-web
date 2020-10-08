import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import {
  sendMoneyBuilder,
  SendMoneyInterface,
  TransactionType,
  SetupDatasetInterface,
  setupDatasetBuilder,
  removeDatasetBuilder,
  RemoveDatasetInterface,
} from 'zoobc-sdk';

// ========================== INPUT MAP ========================== //

export const escrowForm = {
  addressApprover: 'addressApprover',
  typeCommission: 'typeCommission',
  approverCommission: 'approverCommission',
  timeout: 'timeout',
  instruction: 'instruction',
};

export const sendMoneyForm = {
  sender: 'sender',
  recipient: 'recipient',
  alias: 'alias',
  amount: 'amount',
  fee: 'fee',
  ...escrowForm,
};

export const setupDataSetForm = {
  sender: 'sender',
  property: 'property',
  value: 'value',
  recipientAddress: 'recipientAddress',
  fee: 'fee',
};

export const removeDataSetForm = {
  sender: 'sender',
  property: 'property',
  value: 'value',
  recipientAddress: 'recipientAddress',
  fee: 'fee',
};

export const removeNodeForm = {
  fee: 'fee',
  nodePublicKey: 'nodePublicKey',
};

export const updateNodeForm = {
  ipAddress: 'ipAddress',
  lockedAmount: 'lockedAmount',
  fee: 'fee',
  nodePublicKey: 'nodePublicKey',
};

export const registerNodeForm = {
  ipAddress: 'ipAddress',
  lockedBalance: 'lockedBalance',
  fee: 'fee',
  nodePublicKey: 'nodePublicKey',
};
// =========================== END INPUT MAP ======================= //

export function createInnerTxForm(txType: number) {
  const escrowAddition = {
    addressApprover: new FormControl('', Validators.required),
    approverCommission: new FormControl('', [Validators.required, Validators.min(1 / 1e8)]),
    timeout: new FormControl('', [Validators.required, Validators.min(1), Validators.max(720)]),
    instruction: new FormControl('', Validators.required),
  };
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return new FormGroup({
        sender: new FormControl('', Validators.required),
        recipient: new FormControl('', Validators.required),
        amount: new FormControl('', [Validators.required, Validators.min(1 / 1e8)]),
        alias: new FormControl('', Validators.required),
        fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
        ...escrowAddition,
      });

    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return new FormGroup({
        sender: new FormControl('', Validators.required),
        property: new FormControl('', [Validators.required]),
        value: new FormControl('', [Validators.required]),
        recipientAddress: new FormControl('', Validators.required),
        fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
      });

    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return new FormGroup({
        sender: new FormControl('', Validators.required),
        property: new FormControl('', [Validators.required]),
        value: new FormControl('', [Validators.required]),
        recipientAddress: new FormControl('', Validators.required),
        fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
      });

    case TransactionType.REMOVENODEREGISTRATIONTRANSACTION:
      return new FormGroup({
        fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
        nodePublicKey: new FormControl('', Validators.required),
      });

    case TransactionType.UPDATENODEREGISTRATIONTRANSACTION:
      return new FormGroup({
        ipAddress: new FormControl('', [
          Validators.required,
          Validators.pattern('^https?://+[\\w.-]+:\\d+$'),
        ]),
        lockedAmount: new FormControl('', [Validators.required, Validators.min(1 / 1e8)]),
        fee: new FormControl('', [Validators.required, Validators.min(1 / 1e8)]),
        nodePublicKey: new FormControl('', Validators.required),
      });

    case TransactionType.NODEREGISTRATIONTRANSACTION:
      return new FormGroup({
        ipAddress: new FormControl('', [
          Validators.required,
          Validators.pattern('^https?://+[\\w.-]+:\\d+$'),
        ]),
        lockedBalance: new FormControl('', [Validators.required, Validators.min(1 / 1e8)]),
        fee: new FormControl('', [Validators.required, Validators.min(1 / 1e8)]),
        nodePublicKey: new FormControl('', Validators.required),
      });
  }
}

export function createTxBytes(form: any, txType: number): Buffer {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return createSendMoney(form);
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return createSetupDataset(form);
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return createRemoveSetupDataset(form);
  }
}

export function getFieldList(txType: number): Object {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return sendMoneyForm;
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return setupDataSetForm;
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return removeDataSetForm;
  }
}

export function getTxType(type: number) {
  switch (type) {
    case TransactionType.SENDMONEYTRANSACTION:
      return 'send money';
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return 'setup account dataset';
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return 'remove setup account dataset';
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

function createRemoveSetupDataset(form: any) {
  const { sender, fee, recipientAddress, property, value } = form;
  const data: RemoveDatasetInterface = {
    property,
    value,
    setterAccountAddress: sender,
    recipientAccountAddress: recipientAddress,
    fee: fee,
  };
  return removeDatasetBuilder(data);
}
