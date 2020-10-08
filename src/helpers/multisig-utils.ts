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

// escrow
export const addressApproverField = new FormControl('', Validators.required);
export const approverCommissionField = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
export const instructionField = new FormControl('', Validators.required);
export const timeoutField = new FormControl('', [
  Validators.required,
  Validators.min(1),
  Validators.max(720),
]);

// send money
export const recipientForm = new FormControl('', Validators.required);
export const amountForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
export const aliasField = new FormControl('', Validators.required);

// setup dataset
export const propertyField = new FormControl('', [Validators.required]);
export const valueField = new FormControl('', [Validators.required]);

// ========================= END FORM ============================ //

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

export const claimNodeForm = {
  fee: 'fee',
  nodePublicKey: 'nodePublicKey',
  ipAddress: 'ipAddress',
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
    addressApprover: addressApproverField,
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
        alias: aliasField,
        fee: feeForm,
        ...escrowAddition,
      });

    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return new FormGroup({
        sender: senderForm,
        property: propertyField,
        value: valueField,
        recipientAddress: recipientForm,
        fee: feeForm,
      });

    case TransactionType.CLAIMNODEREGISTRATIONTRANSACTION:
      return new FormGroup({
        fee: new FormControl(environment.fee, [Validators.required, Validators.min(environment.fee)]),
        nodePublicKey: new FormControl('', Validators.required),
        ipAddress: new FormControl('', [
          Validators.required,
          Validators.pattern('^https?://+[\\w.-]+:\\d+$'),
        ]),
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
