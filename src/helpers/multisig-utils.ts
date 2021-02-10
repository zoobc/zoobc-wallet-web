import {
  createEscrowApprovalBytes,
  createEscrowApprovalForm,
  escrowApprovalMap,
} from 'src/app/components/transaction-form/form-escrow-approval/form-escrow-approval.component';
import {
  createRemoveDatasetForm,
  createRemoveSetupDatasetBytes,
  removeDatasetMap,
} from 'src/app/components/transaction-form/form-remove-account-dataset/form-remove-account-dataset.component';
import {
  createSendMoneyBytes,
  createSendMoneyForm,
  sendMoneyMap,
} from 'src/app/components/transaction-form/form-send-money/form-send-money.component';
import {
  createSetupDatasetBytes,
  createSetupDatasetForm,
  setupDatasetMap,
} from 'src/app/components/transaction-form/form-setup-account-dataset/form-setup-account-dataset.component';
import { TransactionType } from 'zbc-sdk';

// =========================== END INPUT MAP ======================= //

export function createInnerTxForm(txType: number) {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return createSendMoneyForm();
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return createSetupDatasetForm();
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return createRemoveDatasetForm();
    case TransactionType.APPROVALESCROWTRANSACTION:
      return createEscrowApprovalForm();
  }
}

export function createInnerTxBytes(form: any, txType: number): Buffer {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return createSendMoneyBytes(form);
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return createSetupDatasetBytes(form);
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return createRemoveSetupDatasetBytes(form);
    case TransactionType.APPROVALESCROWTRANSACTION:
      return createEscrowApprovalBytes(form);
  }
}

export function getInputMap(txType: number): Object {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return sendMoneyMap;
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return setupDatasetMap;
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return removeDatasetMap;
    case TransactionType.APPROVALESCROWTRANSACTION:
      return escrowApprovalMap;
  }
}

export function getTxType(type: number) {
  switch (type) {
    case TransactionType.SENDMONEYTRANSACTION:
      return 'transfer zbc';
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return 'setup account dataset';
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return 'remove setup account dataset';
    case TransactionType.APPROVALESCROWTRANSACTION:
      return 'escrow approval';
  }
}
